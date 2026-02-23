import { ILibro } from "../../books/models/ibooks";

export interface ICart {
    libro: ILibro;
    quantity: number;
}