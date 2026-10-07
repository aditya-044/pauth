export function logError(context, err) {
    if (err instanceof Error) {
        console.error(`${context}: ${err.message}`)
    }
}