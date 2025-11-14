import { Stats } from "./stats";

export type Archivement = {
	name: string;
	image_url: string;
	validator: (stats: Stats) => boolean;
};
