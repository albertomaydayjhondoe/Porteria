import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StripViewer from "@/components/StripViewer";
import ArchiveSlider from "@/components/ArchiveSlider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ComicStrip {
  id: string;
  title: string | null;
  image_url: string;
  publish_date: string;
  media_type?: 'image' | 'video' | 'audio';
  video_url?: string;
  audio_url?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [strips, setStrips] = useState<ComicStrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrips();
  }, []);

  const loadStrips = async () => {
    try {
      // Datos locales como respaldo
      const localStrips = [
        {
          id: "local-020",
          title: "Primera Tira",
          video_url: "/Porteria/strips/video-020.mp4", image_url: "/Porteria/strips/thumb-020.jpg", media_type: 'video' as const,
          publish_date: "2025-12-09"
        },
        {
          id: "local-019",
          title: "El Misterio del 3º B",
          video_url: "/Porteria/strips/video-019.mp4", image_url: "/Porteria/strips/thumb-019.jpg", media_type: 'video' as const,
          publish_date: "2025-12-08"
        },
        {
          id: "local-018",
          title: "Inspección Sanitaria",
          video_url: "/Porteria/strips/video-018.mp4", image_url: "/Porteria/strips/thumb-018.jpg", media_type: 'video' as const,
          publish_date: "2025-12-07"
        },
        {
          id: "local-017",
          title: "La Llave Perdida",
          video_url: "/Porteria/strips/video-017.mp4", image_url: "/Porteria/strips/thumb-017.jpg", media_type: 'video' as const,
          publish_date: "2025-12-06"
        },
        {
          id: "local-016",
          title: "Visita del Técnico",
          video_url: "/Porteria/strips/video-016.mp4", image_url: "/Porteria/strips/thumb-016.jpg", media_type: 'video' as const,
          publish_date: "2025-12-05"
        },
        {
          id: "local-015",
          title: "Día de Mudanza",
          video_url: "/Porteria/strips/video-015.mp4", image_url: "/Porteria/strips/thumb-015.jpg", media_type: 'video' as const,
          publish_date: "2025-12-04"
        },
        {
          id: "local-014",
          title: "Buzón Atascado",
          video_url: "/Porteria/strips/video-014.mp4", image_url: "/Porteria/strips/thumb-014.jpg", media_type: 'video' as const,
          publish_date: "2025-12-03"
        },
        {
          id: "local-013",
          title: "Navidad Anticipada",
          video_url: "/Porteria/strips/video-013.mp4", image_url: "/Porteria/strips/thumb-013.jpg", media_type: 'video' as const,
          publish_date: "2025-12-02"
        },
        {
          id: "local-012",
          title: "La Vecina Chismosa",
          video_url: "/Porteria/strips/video-012.mp4", image_url: "/Porteria/strips/thumb-012.jpg", media_type: 'video' as const,
          publish_date: "2025-12-01"
        },
        {
          id: "local-011",
          title: "Apagón General",
          video_url: "/Porteria/strips/video-011.mp4", image_url: "/Porteria/strips/thumb-011.jpg", media_type: 'video' as const,
          publish_date: "2025-11-30"
        },
        {
          id: "local-010",
          title: "El Cartero Sustituto",
          video_url: "/Porteria/strips/video-010.mp4", image_url: "/Porteria/strips/thumb-010.jpg", media_type: 'video' as const,
          publish_date: "2025-11-29"
        },
        {
          id: "local-009",
          title: "Reforma en el Ático",
          video_url: "/Porteria/strips/video-009.mp4", image_url: "/Porteria/strips/thumb-009.jpg", media_type: 'video' as const,
          publish_date: "2025-11-28"
        },
        {
          id: "local-008",
          title: "El Perro del 5º",
          video_url: "/Porteria/strips/video-008.mp4", image_url: "/Porteria/strips/thumb-008.jpg", media_type: 'video' as const,
          publish_date: "2025-11-27"
        },
        {
          id: "local-007",
          title: "Fiesta Nocturna",
          video_url: "/Porteria/strips/video-007.mp4", image_url: "/Porteria/strips/thumb-007.jpg", media_type: 'video' as const,
          publish_date: "2025-11-26"
        },
        {
          id: "local-006",
          title: "Horario de Basura",
          video_url: "/Porteria/strips/video-006.mp4", image_url: "/Porteria/strips/thumb-006.jpg", media_type: 'video' as const,
          publish_date: "2025-11-25"
        },
        {
          id: "local-005",
          title: "El Ascensor Averiado",
          video_url: "/Porteria/strips/video-005.mp4", image_url: "/Porteria/strips/thumb-005.jpg", media_type: 'video' as const,
          publish_date: "2025-11-24"
        },
        {
          id: "local-004",
          title: "La Conexión WiFi",
          video_url: "/Porteria/strips/video-004.mp4", image_url: "/Porteria/strips/thumb-004.jpg", media_type: 'video' as const,
          publish_date: "2025-11-23"
        },
        {
          id: "local-003",
          title: "Reunión de Consorcio",
          video_url: "/Porteria/strips/video-003.mp4", image_url: "/Porteria/strips/thumb-003.jpg", media_type: 'video' as const,
          publish_date: "2025-11-22"
        },
        {
          id: "local-002",
          title: "Paquetería Confusa",
          video_url: "/Porteria/strips/video-002.mp4", image_url: "/Porteria/strips/thumb-002.jpg", media_type: 'video' as const,
          publish_date: "2025-11-21"
        },
        {
          id: "local-001",
          title: "El Nuevo Inquilino",
          video_url: "/Porteria/strips/video-001.mp4", image_url: "/Porteria/strips/thumb-001.jpg", media_type: 'video' as const,
          publish_date: "2025-11-20"
        }
      ];

      // Si no hay cliente de Supabase (GitHub Pages), usar solo datos locales
      if (!supabase) {
        setStrips(localStrips);
        return;
      }

      const { data, error } = await supabase
        .from("comic_strips")
        .select("*")
        .order("publish_date", { ascending: false });

      if (error) {
        // Si hay error con Supabase, usar datos locales
        setStrips(localStrips);
      } else {
        // Combinar datos de Supabase con locales
        const allStrips = [...(data || []), ...localStrips];
        setStrips(allStrips.length > 0 ? allStrips : localStrips);
      }
    } catch (error: any) {
      // Si falla completamente, usar datos locales completos
      const localStrips = [
        { id: "local-020", title: "Primera Tira", video_url: "/Porteria/strips/video-020.mp4", image_url: "/Porteria/strips/thumb-020.jpg", media_type: 'video' as const, publish_date: "2025-12-09" },
        { id: "local-019", title: "El Misterio del 3º B", video_url: "/Porteria/strips/video-019.mp4", image_url: "/Porteria/strips/thumb-019.jpg", media_type: 'video' as const, publish_date: "2025-12-08" },
        { id: "local-018", title: "Inspección Sanitaria", video_url: "/Porteria/strips/video-018.mp4", image_url: "/Porteria/strips/thumb-018.jpg", media_type: 'video' as const, publish_date: "2025-12-07" },
        { id: "local-017", title: "La Llave Perdida", video_url: "/Porteria/strips/video-017.mp4", image_url: "/Porteria/strips/thumb-017.jpg", media_type: 'video' as const, publish_date: "2025-12-06" },
        { id: "local-016", title: "Visita del Técnico", video_url: "/Porteria/strips/video-016.mp4", image_url: "/Porteria/strips/thumb-016.jpg", media_type: 'video' as const, publish_date: "2025-12-05" },
        { id: "local-015", title: "Día de Mudanza", video_url: "/Porteria/strips/video-015.mp4", image_url: "/Porteria/strips/thumb-015.jpg", media_type: 'video' as const, publish_date: "2025-12-04" },
        { id: "local-014", title: "Buzón Atascado", video_url: "/Porteria/strips/video-014.mp4", image_url: "/Porteria/strips/thumb-014.jpg", media_type: 'video' as const, publish_date: "2025-12-03" },
        { id: "local-013", title: "Navidad Anticipada", video_url: "/Porteria/strips/video-013.mp4", image_url: "/Porteria/strips/thumb-013.jpg", media_type: 'video' as const, publish_date: "2025-12-02" },
        { id: "local-012", title: "La Vecina Chismosa", video_url: "/Porteria/strips/video-012.mp4", image_url: "/Porteria/strips/thumb-012.jpg", media_type: 'video' as const, publish_date: "2025-12-01" },
        { id: "local-011", title: "Apagón General", video_url: "/Porteria/strips/video-011.mp4", image_url: "/Porteria/strips/thumb-011.jpg", media_type: 'video' as const, publish_date: "2025-11-30" },
        { id: "local-010", title: "El Cartero Sustituto", video_url: "/Porteria/strips/video-010.mp4", image_url: "/Porteria/strips/thumb-010.jpg", media_type: 'video' as const, publish_date: "2025-11-29" },
        { id: "local-009", title: "Reforma en el Ático", video_url: "/Porteria/strips/video-009.mp4", image_url: "/Porteria/strips/thumb-009.jpg", media_type: 'video' as const, publish_date: "2025-11-28" },
        { id: "local-008", title: "El Perro del 5º", video_url: "/Porteria/strips/video-008.mp4", image_url: "/Porteria/strips/thumb-008.jpg", media_type: 'video' as const, publish_date: "2025-11-27" },
        { id: "local-007", title: "Fiesta Nocturna", video_url: "/Porteria/strips/video-007.mp4", image_url: "/Porteria/strips/thumb-007.jpg", media_type: 'video' as const, publish_date: "2025-11-26" },
        { id: "local-006", title: "Horario de Basura", video_url: "/Porteria/strips/video-006.mp4", image_url: "/Porteria/strips/thumb-006.jpg", media_type: 'video' as const, publish_date: "2025-11-25" },
        { id: "local-005", title: "El Ascensor Averiado", video_url: "/Porteria/strips/video-005.mp4", image_url: "/Porteria/strips/thumb-005.jpg", media_type: 'video' as const, publish_date: "2025-11-24" },
        { id: "local-004", title: "La Conexión WiFi", video_url: "/Porteria/strips/video-004.mp4", image_url: "/Porteria/strips/thumb-004.jpg", media_type: 'video' as const, publish_date: "2025-11-23" },
        { id: "local-003", title: "Reunión de Consorcio", video_url: "/Porteria/strips/video-003.mp4", image_url: "/Porteria/strips/thumb-003.jpg", media_type: 'video' as const, publish_date: "2025-11-22" },
        { id: "local-002", title: "Paquetería Confusa", video_url: "/Porteria/strips/video-002.mp4", image_url: "/Porteria/strips/thumb-002.jpg", media_type: 'video' as const, publish_date: "2025-11-21" },
        { id: "local-001", title: "El Nuevo Inquilino", video_url: "/Porteria/strips/video-001.mp4", image_url: "/Porteria/strips/thumb-001.jpg", media_type: 'video' as const, publish_date: "2025-11-20" }
      ];
      setStrips(localStrips);
      console.log("Usando datos locales:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (strips.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">No hay tiras publicadas aún</h2>
            <p className="text-muted-foreground">Vuelve pronto para ver el contenido</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const latestStrip = strips[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Latest strip */}
        <StripViewer strips={strips} />

        {/* Archive slider */}
        {strips.length > 1 && (
          <ArchiveSlider
            strips={strips.slice(1).map(s => ({
              id: s.id,
              imageUrl: s.image_url,
              date: s.publish_date,
              title: s.title || undefined,
              mediaType: s.media_type,
            }))}
            onStripClick={(id) => navigate(`/archivo`)}
          />
        )}

        {/* Call to action */}
        <section className="py-16 px-6 text-center">
          <div className="container mx-auto max-w-2xl">
            <div className="border-2 border-primary p-12 bg-card shadow-editorial">
              <h3 className="text-3xl font-bold mb-4">
                No te pierdas ninguna edición
              </h3>
              <p className="text-muted-foreground mb-6">
                Visita el archivo completo para recorrer todas las tiras desde el principio
              </p>
              <button
                onClick={() => navigate('/archivo')}
                className="inline-block border-2 border-primary px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Ver Archivo Completo
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
