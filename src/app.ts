import fastify from "fastify";
import { fastifySwagger } from '@fastify/swagger';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { getCoursesRoute } from "./routes/get-courses.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { createCourseRoute } from "./routes/create-course.ts";
import scalarAPIReference from '@scalar/fastify-api-reference'
import { loginRoute } from "./routes/login.ts";


const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Desafio Node.js',
                version: '1.0.0'
            }
        },
        transform: jsonSchemaTransform
    })

    server.register(scalarAPIReference, {
        routePrefix: '/docs'
    })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

// const courses = [
//   {
//     id: "1",
//     title: "Curso de Node.js",
//   },
// ];


server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCourseRoute)
server.register(loginRoute)

export { server }