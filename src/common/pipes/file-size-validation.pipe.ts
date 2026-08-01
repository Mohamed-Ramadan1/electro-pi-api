import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const twoMb = 2 * 1024 * 1024; // 2 MB in bytes
    return value.size < twoMb;
  }
}
