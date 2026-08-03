import {
  ArgumentMetadata,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const twoMb = 2 * 1024 * 1024;
    if (value?.size > twoMb) {
      throw new PayloadTooLargeException('File size exceeds 2 MB limit');
    }
    return value;
  }
}
