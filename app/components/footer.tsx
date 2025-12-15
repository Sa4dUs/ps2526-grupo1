export default function Footer() {
	return (
		<footer className="py-6 text-center text-sm text-muted-foreground border-t border-border" style={{ backgroundColor: '#ffffffff' }}>
			© {new Date().getFullYear()} EduMath
		</footer>
	);
}
