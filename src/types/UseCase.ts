export default interface UseCase {
    data: any | any[] | undefined;
    message: string;
    error?: string | unknown;
}