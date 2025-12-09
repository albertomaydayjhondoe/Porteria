const Footer = () => {
  return (
    <footer className="border-t-2 border-primary bg-background mt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold mb-2">PAPERBOY</p>
            <p className="text-xs tracking-widest uppercase text-muted-foreground">
              Tira diaria · La Portería
            </p>
          </div>
          
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Paperboy.</p>
            <p className="mt-1">Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
