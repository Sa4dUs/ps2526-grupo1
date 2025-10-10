import Image from "next/image";
//future main page, this comment is temporal, just for someone new that reads this 
export default function Home() {
  return (
    <div className="flex flex-col h-screen">
  <header className="flex flex-row justify-between p-10 space-x-4">
    <a href="">Perfil</a>
    <a href="">Configuracion</a>
  </header>
  <main className="flex flex-grow flex-col items-center justify-around px-4 text-center">
    <section className="flex flex-col justify-between h-32">
      <h2 className="text-xl">Iniciar sesión</h2>
      <div className="flex flex-row justify-around">
        <a href="/login" className="btn btn-primary w-50 mx-5">Login</a>
        <a href="/signup" className="btn btn-secondary w-50 mx-5">Signup</a>
      </div>
    </section>

    <section className="flex flex-col justify-between h-32 mb-10">
      <h2 className="text-xl">Modos de Juego</h2>
      <div className="flex flex-row justify-around">
        <a href="/login" className="btn btn-primary w-50 mx-5">Modo desafío</a>
        <a href="/signup" className="btn btn-secondary w-50 mx-5">Modo contra-reloj</a>
      </div>
    </section>
  </main>
  </div>

  );
}
