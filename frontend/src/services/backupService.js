import { getToken } from "@/utils/auth";
import axios from "@/lib/axios";

export async function backupExport() {
    const authToken = getToken();
    const response = await axios.get(
        "/backup/export",
        {
            headers: {
                Authorization: authToken
            }
        }
    )

    return response.data;
}

export async function backupImport(data) {
    const authToken = getToken();
    const response = await axios.post(
        "/backup/import",
        data,
        {
            headers: {
                Authorization: authToken
            }
        }
    )

    return response.data;
}
