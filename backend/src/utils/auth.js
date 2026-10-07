import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hashString(str) {
    const hash = await bcrypt.hash(str, saltRounds);
    return hash;
}

export async function compareString(str, hashStr) {
    const isMatched = await bcrypt.compare(str, hashStr);
    return isMatched;
}