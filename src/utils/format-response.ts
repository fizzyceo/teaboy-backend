export function formatSuccessResponse(data: any): any {
  return {
    data,
    success: true,
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
