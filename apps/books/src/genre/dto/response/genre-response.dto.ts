import { Genre } from '../../schema/genre.schema';

export class GenreResponseDto {
  id: string;
  name: string;
  constructor(genre: Genre) {
    this.id = genre._id.toString();
    this.name = genre.name;
  }
}
