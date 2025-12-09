import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-primary px-6 py-2 mb-4">
              <p className="text-xs tracking-[0.3em] uppercase font-medium">
                Sobre el autor
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              La Portería
            </h1>
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <div className="border-2 border-primary p-8 md:p-12 bg-card shadow-editorial">
              <p className="text-xl leading-relaxed mb-6 font-serif">
                <span className="text-6xl float-left mr-4 leading-none font-bold">B</span>
                ienvenido a <strong>Paperboy</strong>, un espacio dedicado a las pequeñas historias 
                que suceden detrás del mostrador de "La Portería", ese lugar de paso obligado 
                donde se cruzan vidas, paquetes, quejas y momentos inesperados.
              </p>

              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                Cada día, una nueva tira cómica explora el universo particular de este espacio: 
                porteros filosóficos, vecinos excéntricos, repartidores agobiados y situaciones 
                cotidianas que merecen ser contadas con humor y sensibilidad.
              </p>

              <div className="my-8 border-t-2 border-primary pt-8">
                <h2 className="text-3xl font-bold mb-4">El Autor</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Detrás de estas tiras está un observador de lo cotidiano, alguien convencido 
                  de que las mejores historias no necesitan dragones ni naves espaciales: 
                  basta con mirar con atención el ir y venir de la gente en el hall de un edificio.
                </p>
              </div>

              <div className="my-8 border-t-2 border-primary pt-8">
                <h2 className="text-3xl font-bold mb-4">El Estilo</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Inspirado en la tradición del cómic de prensa, cada tira busca la síntesis: 
                  tres viñetas, un golpe de humor, una pequeña reflexión. Blanco, negro y gris. 
                  Sin adornos innecesarios. Como debe ser.
                </p>
              </div>

              <div className="my-8 border-t-2 border-primary pt-8 text-center">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  Publicación diaria · Archivo completo disponible
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
