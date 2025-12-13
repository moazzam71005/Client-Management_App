import { TemplateRepository } from '@/repos/template-repo'
import { z } from 'zod'

const templateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
})

export type CreateTemplateInput = z.infer<typeof templateSchema>
export type UpdateTemplateInput = Partial<CreateTemplateInput>

export class TemplateService {
    private repo: TemplateRepository

    constructor() {
        this.repo = new TemplateRepository()
    }

    async getTemplates(userId: string) {
        return this.repo.getTemplates(userId)
    }

    async createTemplate(userId: string, data: CreateTemplateInput) {
        const validated = templateSchema.parse(data)
        return this.repo.createTemplate({
            ...validated,
            user_id: userId,
        })
    }

    async updateTemplate(id: string, userId: string, data: UpdateTemplateInput) {
        const validated = templateSchema.partial().parse(data)
        return this.repo.updateTemplate(id, userId, validated)
    }

    async deleteTemplate(id: string, userId: string) {
        return this.repo.deleteTemplate(id, userId)
    }
}
