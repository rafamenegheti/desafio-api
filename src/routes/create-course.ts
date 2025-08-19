import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import z, { uuid } from 'zod';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post("/courses", {
        schema: {
            tags: ['courses'],
            summary: "Create a course",
            description: "Essa rota recebe um título e cria um curso no banco de dados",
            body: z.object({
                title: z.string().min(5, "O título deve ter no mínimo 5 caracteres")
            }),
            response: {
                201: z.object({
                    courseId: uuid()
                })
            }
        },
    }, async (request, reply) => {

        const courseTitle = request.body.title

        const result = await db.insert(courses).values({
            title: courseTitle
        }).returning()

        return reply.status(201).send({ courseId: result[0].id })
    });

}