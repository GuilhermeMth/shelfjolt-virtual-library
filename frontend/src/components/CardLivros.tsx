import onePieceCover from "../assets/image.png";

type CardLivrosProps = {
	title: string;
	imageUrl?: string;
	tags?: string[];
	author?: string;
	publishedAt?: string;
	onRead?: () => void;
	onSave?: () => void;
};

export default function CardLivros({
	title,
	imageUrl = onePieceCover,
	tags = [],
	author = "",
	publishedAt = "",
	onRead,
	onSave,
}: CardLivrosProps) {
	return (
		<article className="w-full max-w-[260px] rounded-3xl bg-white p-3 shadow-md transition hover:shadow-lg">

			{/* IMAGEM */}
			<div className="relative overflow-hidden rounded-2xl">
				<div className="aspect-[2/3] w-full">
					<img
						src={imageUrl}
						alt={title}
						className="h-full w-full object-cover transition duration-300 hover:scale-105"
					/>
				</div>

				{/* gradiente */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

				{/* tags */}
				{tags.length > 0 && (
					<div className="absolute bottom-3 right-3 flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-[#F3D6BE] bg-[#FFF5EA] px-2 py-1 text-[10px] font-semibold text-[#C07B4A]"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>

			{/* CONTEÚDO */}
			<div className="px-1 pt-3 pb-1">
				<h3 className="line-clamp-2 text-base font-semibold text-gray-900">
					{title}
				</h3>

				{(author || publishedAt) && (
					<p className="mt-1 text-[11px] text-[#C07B4A]">
						Publicado por {author}
						{publishedAt ? `, ${publishedAt}` : ""}
					</p>
				)}

				{/* BOTÕES */}
				<div className="mt-4 flex flex-col gap-2 sm:flex-row">
					<button
						onClick={onRead}
						className="w-full rounded-xl bg-[#8B5E66] py-2 text-sm font-semibold text-white"
					>
						Iniciar Leitura
					</button>

					<button
						onClick={onSave}
						className="w-full rounded-xl bg-[#8B5E66] py-2 text-sm font-semibold text-white sm:w-auto sm:px-4"
					>
						Salvar
					</button>
				</div>
			</div>
		</article>
	);
}