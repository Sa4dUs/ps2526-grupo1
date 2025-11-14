import { Archivement } from "@/types/achievements";

export const ACHIEVEMENTS: Archivement[] = [
	{
		name: "First Step",
		image_url: "/achievements/first_step.png",
		validator: (stats) => stats.total_games >= 1,
	},
	{
		name: "Warming Up",
		image_url: "/achievements/warmup.png",
		validator: (stats) => stats.total_games >= 10,
	},
	{
		name: "Veteran",
		image_url: "/achievements/veteran.png",
		validator: (stats) => stats.total_games >= 100,
	},
	{
		name: "First Record",
		image_url: "/achievements/first_record.png",
		validator: (stats) => stats.best_score >= 1,
	},
	{
		name: "Skilled Player",
		image_url: "/achievements/good.png",
		validator: (stats) => stats.best_score >= 50,
	},
	{
		name: "Pro",
		image_url: "/achievements/pro.png",
		validator: (stats) => stats.best_score >= 100,
	},
	{
		name: "Legend",
		image_url: "/achievements/legendary.png",
		validator: (stats) => stats.best_score >= 200,
	},
	{
		name: "Consistency",
		image_url: "/achievements/consistency.png",
		validator: (stats) => stats.times.length >= 5,
	},
	{
		name: "Marathoner",
		image_url: "/achievements/marathon.png",
		validator: (stats) => stats.times.length >= 20,
	},
	{
		name: "Speedrunner",
		image_url: "/achievements/speedrunner.png",
		validator: (stats) =>
			stats.times.length > 0 && Math.min(...stats.times) <= 30,
	},
	{
		name: "Unstoppable",
		image_url: "/achievements/unstoppable.png",
		validator: (stats) =>
			stats.best_score > 0 &&
			stats.times.length >= 10 &&
			stats.total_games >= 20,
	},
	{
		name: "Perfectionist",
		image_url: "/achievements/perfectionist.png",
		validator: (stats) =>
			stats.times.length > 0 && stats.times.every((t) => t <= 60),
	},
	{
		name: "Full Power",
		image_url: "/achievements/full_power.png",
		validator: (stats) =>
			stats.best_score >= 150 && stats.total_games >= 50,
	},
];
