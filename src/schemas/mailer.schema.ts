import { object, string, z } from 'zod';

const postSchema = object({
  name: string().min(1),
  email: string().min(1).email(),
  subject: string().min(1),
  message: string().min(1),
});

export type IMailerPostSchema = z.infer<typeof postSchema>;

export const MailerSchema = {
  post: postSchema,
};
