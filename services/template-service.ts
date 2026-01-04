import { TemplateRepository } from '@/repos/template-repo'
import { templateSchema, type CreateTemplateInput, type UpdateTemplateInput } from '@/dtos/template.dto'

export type { CreateTemplateInput, UpdateTemplateInput }

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
