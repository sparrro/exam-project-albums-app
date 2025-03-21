const sendResponse = (status: number, success: boolean, message: string, data?: object) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Header": "*",
        },
        body: JSON.stringify({"success": success, "message": message, "data": data}),
    }
}

const sendError = (status: number, message: string) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Header": "*",
        },
        body: JSON.stringify({"success": false, "message": message}),
    }
}

export { sendResponse, sendError }