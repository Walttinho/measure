import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MeasureRepository } from '../../measure/repository/measure.repository';
import { Measure, MeasureType } from '@prisma/client';
import { CustomerService } from '../../customer/service/customer.service';
import { ConfirmMeasureDto, CreateMeasureRequestDto } from '../dto/measure.dto';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class MeasureService {
  constructor(
    private readonly measureRepository: MeasureRepository,
    private readonly customerService: CustomerService,
  ) {}
  async readMeasure(body: CreateMeasureRequestDto) {
    this.validateUploadRequest(body);

    const customer = await this.findCustomer(body.customer_code);

    await this.checkForExistingMeasure(
      customer.id,
      body.measure_type,
      body.measure_datetime,
    );

    const value = await this.extractMeasureValueFromImage(body.image);

    const measure = await this.createMeasureEntry(customer.id, body, value);

    return this.createMeasureResponse(measure);
  }
  async confirmMeasure(body: ConfirmMeasureDto) {
    this.validateConfirmRequest(body);

    const measure = await this.findMeasureByUUID(body.measure_uuid);

    this.checkIfMeasureAlreadyConfirmed(measure);

    await this.upadateMeasureData(body.measure_uuid, body.confirmed_value);

    return { success: true };
  }

  async listMeasures(customer_code: string, measure_type?: MeasureType) {
    const customer = await this.findCustomer(customer_code);

    const measures = await this.getCustomerMeasures(customer.id, measure_type);

    return this.createMeasuresListResponse(customer.customer_code, measures);
  }
  async getMeasureByUUID(measure_uuid: string): Promise<Measure | null> {
    return this.measureRepository.findByUUID(measure_uuid);
  }

  async getMeasureByCustomerAndMonth(
    customer_code: string,
    measureType: MeasureType,
    month: Date,
  ): Promise<Measure | null> {
    return this.measureRepository.findByCustomerAndMonth(
      customer_code,
      measureType,
      month,
    );
  }

  async createMeasure(data: Partial<Measure>): Promise<Measure> {
    return this.measureRepository.create(data);
  }

  async updateMeasure(
    measure_uuid: string,
    data: Partial<Measure>,
  ): Promise<Measure> {
    return this.measureRepository.update(measure_uuid, data);
  }

  async getAllMeasuresByCustomer(
    customer_code: string,
    measureType?: MeasureType,
  ): Promise<Measure[]> {
    return this.measureRepository.findAllByCustomer(customer_code, measureType);
  }

  private validateUploadRequest(body: CreateMeasureRequestDto) {
    if (
      !body.image ||
      !body.customer_code ||
      !body.measure_datetime ||
      !body.measure_type
    ) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Dados da requisição são inválidos.',
      });
    }

    if (!this.isValidBase64Image(body.image)) {
      throw new BadRequestException({
        error_code: 'INVALID_IMAGE_FORMAT',
        error_description: 'O formato da imagem base64 é inválido.',
      });
    }

    if (isNaN(new Date(body.measure_datetime).getTime())) {
      throw new BadRequestException({
        error_code: 'INVALID_DATE',
        error_description: 'A data fornecida é inválida.',
      });
    }
  }

  private async findCustomer(customer_code: string) {
    const customer =
      await this.customerService.getCustomerByCode(customer_code);

    if (!customer) {
      const newCustomer = await this.customerService.createCustomer({
        customer_code,
      });

      return newCustomer;
    }

    return customer;
  }

  private async checkForExistingMeasure(
    customer_code: string,
    measure_type: MeasureType,
    measure_datetime: Date,
  ) {
    const existingMeasure = await this.getMeasureByCustomerAndMonth(
      customer_code,
      measure_type,
      new Date(measure_datetime),
    );

    if (existingMeasure) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada.',
      });
    }
  }

  private async uploadImage(base64Image: string): Promise<string> {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

    try {
      const response = await fileManager.uploadFile(base64Image, {
        mimeType: 'image/png',
        displayName: 'measure',
      });

      return response.file.uri;
    } catch (error) {
      throw new BadRequestException({
        error_code: 'LLM_API_ERROR',
        error_description: 'Erro ao integrar com a API LLM.',
      });
    }
  }

  private async createMeasureEntry(
    customer_id: string,
    body: CreateMeasureRequestDto,
    value: number,
  ) {
    const measure_uuid = this.generateUUID();

    return this.createMeasure({
      measure_uuid,
      image: body.image,
      measure_value: value,
      measure_type: body.measure_type,
      measure_datetime: new Date(body.measure_datetime),
      customer_id,
    });
  }

  private createMeasureResponse(measure) {
    return {
      image: measure.image,
      measure_value: measure.measure_value,
      measure_uuid: measure.measure_uuid,
    };
  }

  private validateConfirmRequest(body: ConfirmMeasureDto) {
    if (!body.measure_uuid || body.confirmed_value === undefined) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Dados da requisição são inválidos.',
      });
    }
  }

  private async findMeasureByUUID(measure_uuid: string) {
    const measure = await this.getMeasureByUUID(measure_uuid);

    if (!measure) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada.',
      });
    }

    return measure;
  }

  private checkIfMeasureAlreadyConfirmed(measure) {
    if (measure.has_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada.',
      });
    }
  }

  private async upadateMeasureData(
    measure_uuid: string,
    confirmed_value: number,
  ) {
    await this.updateMeasure(measure_uuid, {
      measure_value: confirmed_value,
      has_confirmed: true,
    });
  }

  private async getCustomerMeasures(
    customer_code: string,
    measure_type?: MeasureType,
  ) {
    const measures = await this.getAllMeasuresByCustomer(
      customer_code,
      measure_type ? (measure_type.toUpperCase() as MeasureType) : undefined,
    );

    if (!measures.length) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada.',
      });
    }

    return measures;
  }

  private createMeasuresListResponse(customer_code: string, measures) {
    return {
      customer_code,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image: measure.image,
      })),
    };
  }

  private isValidBase64Image(base64Image: string): boolean {
    const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
    return base64Pattern.test(base64Image);
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  private async extractMeasureValueFromImage(
    base64Image: string,
  ): Promise<number> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt =
        'Extract a numeric value from the following image: reswponse only numbers';
      const result = await model.generateContent([prompt, base64Image]);

      const value = parseInt(result.response.text(), 10);
      if (isNaN(value)) {
        throw new Error('Failed to extract a valid numeric value.');
      }

      return value;
    } catch (error) {
      throw new BadRequestException({
        error_code: 'NUMERIC_EXTRACTION_ERROR',
        error_description: 'Erro ao extrair valor numérico da imagem.',
      });
    }
  }
}
