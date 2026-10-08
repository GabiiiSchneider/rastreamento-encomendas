import { prisma } from "../../lib/prisma";
import { livrosService } from "../livros/livros.compose";
import { ReviewsRepository } from "./reviews.repository";
import { ReviewsService } from "./reviews.service";

export const reviewsService = new ReviewsService(new ReviewsRepository(prisma), livrosService);
