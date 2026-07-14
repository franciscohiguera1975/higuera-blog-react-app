// src/api/categories.api.test.ts
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { createCategory, getCategories } from './categories.api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

describe('createCategory()', () => {
    it('should return the created category', async () => {
        const category = await createCategory({ name: 'Frontend' })
        expect(category).toMatchObject({ id: 'cat-new', name: 'Frontend' })
    })

    it('should send the payload as the request body', async () => {
        let receivedBody: unknown
        server.use(
            http.post(`${BASE_URL}/categories`, async ({ request }) => {
                receivedBody = await request.json()
                return HttpResponse.json({ success: true, message: 'OK', data: { id: 'cat-new', name: 'Frontend' } })
            }),
        )

        await createCategory({ name: 'Frontend' })
        expect(receivedBody).toEqual({ name: 'Frontend' })
    })
})

describe('getCategories()', () => {
    it('should return the paginated items from the API', async () => {
        const result = await getCategories()
        expect(result.items).toHaveLength(3)
        expect(result.items[0]).toMatchObject(
            { name: 'Tech' })
    })

    it('should return the paginated items from the API', async () => {
        const result = await getCategories()
        expect(result.items).toHaveLength(3)
        expect(result.items).toMatchObject(
            [{ name: 'Tech' },
            { name: 'Cinema' }, 
            { name: 'Documental' }])
    })

    it('should expose pagination meta', async () => {
        const result = await getCategories()
        expect(result.meta).toMatchObject({ totalItems: 3, totalPages: 1, currentPage: 1 })
    })
})