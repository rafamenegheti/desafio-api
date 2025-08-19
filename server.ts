import fastify from "fastify";
import { fastifySwagger } from '@fastify/swagger';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { createCourseRoute } from "./src/routes/create-course.ts";
import scalarAPIReference from '@scalar/fastify-api-reference'


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

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running");
});
