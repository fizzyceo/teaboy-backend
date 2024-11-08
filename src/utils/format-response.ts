export function formatSuccessResponse(data: any): any {
  return {
    success: true,

    data,
  };
}

export function formatErrorResponse(message: string, errors: any[] = []): any {
  return {
    success: false,
    message,
    errors,
    data: null,
  };
}
