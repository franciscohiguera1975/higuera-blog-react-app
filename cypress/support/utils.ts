// cypress/support/utils.ts
// Genera identificadores únicos por corrida para no chocar contra la base real
// (no hay endpoint de reset ni seed de datos entre corridas de Cypress).
export function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`
}

export function uniqueUsername() {
  return `cy-user-${uniqueSuffix()}`
}

export function uniqueEmail() {
  return `${uniqueUsername()}@example.com`
}

export function uniqueName(prefix: string) {
  return `${prefix} ${uniqueSuffix()}`
}