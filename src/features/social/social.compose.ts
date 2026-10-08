import { prisma } from "../../lib/prisma";
import { SocialRepository } from "./social.repository";
import { SocialService } from "./social.service";

export const socialService = new SocialService(new SocialRepository(prisma));
