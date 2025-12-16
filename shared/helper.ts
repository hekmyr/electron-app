export type WithoutId<T> = Omit<T, "id">;

export const MIN_AGE = 16;

export function calculateAge(birthdate: Date | string): number {
    const dob = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
