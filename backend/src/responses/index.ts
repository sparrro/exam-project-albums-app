const sendResponse = (status: number, success: boolean, message: string, data?: object) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"success": success, "message": message, "data": data}),
    }
}

const sendError = (status: number, message: string) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    }
}

export { sendResponse, sendError }