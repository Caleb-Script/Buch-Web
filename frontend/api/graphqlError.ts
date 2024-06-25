import { GraphQLError } from "graphql";
export async function extractErrorMessage(
    error: GraphQLError,
): Promise<string> {
    if (
        (error.extensions && error.extensions.code === "BAD_USER_INPUT") ||
        error.extensions.code === "BAD_USER_INPUT"
    ) {
        let stacktrace: string[] | undefined;

        if (Array.isArray(error.extensions.stacktrace)) {
            stacktrace = error.extensions.stacktrace as string[];
        }

        if (
            stacktrace &&
            stacktrace.length > 0 &&
            error.message === undefined
        ) {
            const firstEntry = stacktrace[0];
            const errorMessage = firstEntry
                .substring(firstEntry.indexOf(":") + 1)
                .trim();
            console.log("Unexpected BAD_USER_INPUT error:", stacktrace[0]);
            return errorMessage;
        }

        console.log(
            "Unexpected BAD_USER_INPUT error:",
            error.extensions.stacktrace,
        );
        console.error(error.message);
        return (
            error.message ||
            "Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten."
        );
    }

    return "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
}

export interface GraphqlErrorResponse {
    errors: GraphQLErrorItem[];
    data: unknown;
}

export interface GraphQLErrorItem {
    message: string;
    locations: StacktraceLocation[];
    path: string[];
    extensions: StacktraceExtension;
}

interface StacktraceLocation {
    line: number;
    column: number;
}

interface StacktraceExtension {
    code: string;
    stacktrace: string[];
}
