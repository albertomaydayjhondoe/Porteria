import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Eye, EyeOff, LogOut, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ComicStrip {
  id: string;
  title: string;
  image_url: string;
  publish_date: string;
  media_type?: 'image' | 'video' | 'audio';
  video_url?: string;
  audio_url?: string;
}

// Configuración - Cambiar según necesites
const GITHUB_REPO = "albertomaydayjhondoe/Porteria";
const GITHUB_BRANCH = "main";
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150 MB en bytes

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubToken, setGithubToken] = useState("");

  // Upload state
  const [strips, setStrips] = useState<ComicStrip[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newStrip, setNewStrip] = useState({
    title: "",
    publishDate: new Date().toISOString().split('T')[0],
    mediaType: "image" as "image" | "video" | "audio"
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);

  useEffect(() => {
    // Verificar si ya está autenticado
    const token = sessionStorage.getItem('github_token');
    if (token) {
      setGithubToken(token);
      setIsAuthenticated(true);
      loadStrips();
    }
  }, []);

  const handleLogin = () => {
    // Autenticación simple con el token de GitHub
    if (password.startsWith('ghp_') || password.startsWith('github_pat_')) {
      sessionStorage.setItem('github_token', password);
      setGithubToken(password);
      setIsAuthenticated(true);
      setPassword("");
      toast.success("Autenticado correctamente");
      loadStrips();
    } else {
      toast.error("Token de GitHub inválido. Debe empezar con 'ghp_' o 'github_pat_'");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('github_token');
    setGithubToken("");
    setIsAuthenticated(false);
    toast.info("Sesión cerrada");
  };

  const loadStrips = async () => {
    try {
      const response = await fetch('/Porteria/data/strips.json');
      const data = await response.json();
      setStrips(data.strips || []);
    } catch (error) {
      console.error("Error loading strips:", error);
      setStrips([]);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const uploadFileToGitHub = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const content = reader.result as string;
          const base64Content = content.split(',')[1]; // Remove data:image/...;base64,

          console.log(`Uploading ${file.name} to ${path}...`);
          
          // Verificar si el archivo ya existe primero
          let sha = undefined;
          try {
            const checkResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
              }
            });
            
            if (checkResponse.ok) {
              const existingFile = await checkResponse.json();
              sha = existingFile.sha;
              console.log(`File exists, will update with SHA: ${sha}`);
            }
          } catch (checkError) {
            console.log('File does not exist, will create new');
          }

          // Subir o actualizar el archivo
          const uploadBody: any = {
            message: `Upload ${file.name} via admin panel (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
            content: base64Content,
            branch: GITHUB_BRANCH
          };
          
          if (sha) {
            uploadBody.sha = sha;
          }

          const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadBody)
          });

          if (!response.ok) {
            const errorText = await response.text();
            let error;
            try {
              error = JSON.parse(errorText);
            } catch {
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            console.error('Upload error:', error);
            
            // Errores específicos
            if (response.status === 401) {
              throw new Error('Token inválido o expirado. Genera un nuevo token en GitHub.');
            }
            if (response.status === 403) {
              throw new Error('Sin permisos. Verifica que el token tenga scope "repo".');
            }
            if (error.message?.includes('too large') || error.message?.includes('size')) {
              throw new Error(`Archivo muy grande para GitHub API (límite: 100 MB). Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB. Comprime el video.`);
            }
            
            throw new Error(error.message || `Error ${response.status} al subir archivo`);
          }

          const data = await response.json();
          console.log('Upload successful:', data.content.name);
          
          // Retornar la URL del archivo en el sitio deployado
          const publicUrl = `/Porteria/strips/${file.name}`;
          resolve(publicUrl);
          
        } catch (error: any) {
          console.error('Error in uploadFileToGitHub:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        reject(new Error('Error leyendo el archivo. Intenta de nuevo.'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const updateStripsJSON = async (updatedStrips: ComicStrip[]) => {
    try {
      console.log('Updating strips.json...');
      toast.info('Actualizando base de datos...');
      
      // Obtener el SHA actual del archivo
      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/public/data/strips.json`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Error obteniendo strips.json: ${getResponse.status}`);
      }

      const fileData = await getResponse.json();
      const sha = fileData.sha;
      console.log(`Current strips.json SHA: ${sha}`);

      // Actualizar el archivo
      const jsonContent = JSON.stringify({ strips: updatedStrips }, null, 2);
      const content = btoa(unescape(encodeURIComponent(jsonContent))); // UTF-8 safe
      
      const updateResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/public/data/strips.json`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update strips.json - Add "${updatedStrips[0]?.title || 'new strip'}"`,
            content: content,
            sha: sha,
            branch: GITHUB_BRANCH
          })
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Update error:', errorText);
        throw new Error(`Error ${updateResponse.status} al actualizar strips.json`);
      }

      console.log('strips.json updated successfully');
      toast.success('Base de datos actualizada');
      return true;
    } catch (error: any) {
      console.error('Error in updateStripsJSON:', error);
      throw new Error(`Error actualizando JSON: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (!newStrip.title || !selectedFile) {
      toast.error("Título y archivo son requeridos");
      return;
    }

    // Validar tamaño del archivo
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`Archivo muy grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024} MB`);
      return;
    }

    // Validar tamaño del thumbnail si existe
    if (selectedThumbnail && selectedThumbnail.size > MAX_FILE_SIZE) {
      toast.error(`Thumbnail muy grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024} MB`);
      return;
    }

    setUploading(true);
    try {
      const fileSize = (selectedFile.size / 1024 / 1024).toFixed(2);
      console.log(`Starting upload: ${selectedFile.name} (${fileSize} MB)`);
      toast.info(`Subiendo archivo (${fileSize} MB)...`);
      
      // Generar nombres de archivo únicos
      const timestamp = Date.now();
      const sanitizedTitle = newStrip.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${sanitizedTitle}-${timestamp}.${fileExt}`;
      const filePath = `public/strips/${fileName}`;
      
      console.log(`Uploading main file to: ${filePath}`);
      toast.info('Subiendo archivo principal...');
      const mainFileUrl = await uploadFileToGitHub(selectedFile, filePath);
      toast.success('Archivo principal subido ✓');
      
      // Subir thumbnail si existe
      let thumbnailUrl = mainFileUrl;
      if (selectedThumbnail && newStrip.mediaType !== 'image') {
        const thumbExt = selectedThumbnail.name.split('.').pop();
        const thumbName = `${sanitizedTitle}-thumb-${timestamp}.${thumbExt}`;
        const thumbPath = `public/strips/${thumbName}`;
        
        console.log(`Uploading thumbnail to: ${thumbPath}`);
        toast.info('Subiendo thumbnail...');
        thumbnailUrl = await uploadFileToGitHub(selectedThumbnail, thumbPath);
        toast.success('Thumbnail subido ✓');
      }

      // Crear nueva tira
      const newStripData: ComicStrip = {
        id: generateId(),
        title: newStrip.title,
        image_url: thumbnailUrl,
        publish_date: newStrip.publishDate,
        media_type: newStrip.mediaType
      };

      if (newStrip.mediaType === 'video') {
        newStripData.video_url = mainFileUrl;
        if (!selectedThumbnail) {
          newStripData.image_url = mainFileUrl; // Usar el video como preview también
        }
      } else if (newStrip.mediaType === 'audio') {
        newStripData.audio_url = mainFileUrl;
        if (!selectedThumbnail) {
          newStripData.image_url = '/Porteria/strips/audio-placeholder.png'; // Placeholder para audio
        }
      }

      console.log('New strip data:', newStripData);

      // Actualizar JSON
      const updatedStrips = [newStripData, ...strips];
      await updateStripsJSON(updatedStrips);
      
      // Actualizar UI
      setStrips(updatedStrips);
      setNewStrip({
        title: "",
        publishDate: new Date().toISOString().split('T')[0],
        mediaType: "image"
      });
      setSelectedFile(null);
      setSelectedThumbnail(null);
      
      toast.success("¡Tira subida correctamente! 🎉 Deployment automático en progreso...");
      toast.info("Recarga la página en 1-2 minutos para ver los cambios", { duration: 5000 });
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Error: ${error.message}`, { duration: 8000 });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta tira?")) return;

    try {
      const updatedStrips = strips.filter(s => s.id !== id);
      await updateStripsJSON(updatedStrips);
      setStrips(updatedStrips);
      toast.success("Tira eliminada");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>🔐 Admin Panel</CardTitle>
              <CardDescription>
                Ingresa tu Personal Access Token de GitHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">GitHub Token</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Crear token en:{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    github.com/settings/tokens
                  </a>
                  {" "}(scope: repo)
                </p>
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">
              <Plus className="h-4 w-4 mr-2" />
              Subir Tira
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Trash2 className="h-4 w-4 mr-2" />
              Gestionar ({strips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Subir Nueva Tira</CardTitle>
                <CardDescription>
                  Sube imágenes, videos o audio para tu tira cómica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newStrip.title}
                    onChange={(e) => setNewStrip({...newStrip, title: e.target.value})}
                    placeholder="El Nuevo Inquilino"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha de Publicación</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newStrip.publishDate}
                    onChange={(e) => setNewStrip({...newStrip, publishDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mediaType">Tipo de Medio</Label>
                  <Select
                    value={newStrip.mediaType}
                    onValueChange={(value: any) => setNewStrip({...newStrip, mediaType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">
                    {newStrip.mediaType === 'image' ? 'Imagen' : 
                     newStrip.mediaType === 'video' ? 'Video' : 'Audio'}
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept={
                      newStrip.mediaType === 'image' ? 'image/*' :
                      newStrip.mediaType === 'video' ? 'video/*' : 'audio/*'
                    }
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        📎 {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      {selectedFile.size > MAX_FILE_SIZE && (
                        <p className="text-sm text-red-500 font-medium">
                          ⚠️ Archivo muy grande. Máximo: {MAX_FILE_SIZE / 1024 / 1024} MB
                        </p>
                      )}
                      {selectedFile.size > 100 * 1024 * 1024 && selectedFile.size <= MAX_FILE_SIZE && (
                        <p className="text-sm text-yellow-600">
                          ⚠️ Archivo grande (&gt;100MB). GitHub API tiene límite de 100MB. Considera comprimir el video.
                        </p>
                      )}
                      {selectedFile.size <= 100 * 1024 * 1024 && (
                        <p className="text-sm text-green-600">
                          ✓ Tamaño OK para upload directo
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {newStrip.mediaType !== 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Miniatura (opcional)</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                    />
                    {selectedThumbnail && (
                      <p className="text-sm text-muted-foreground">
                        🖼️ {selectedThumbnail.name}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={uploading || !newStrip.title || !selectedFile}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Tira
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-4">
              {strips.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No hay tiras publicadas aún</p>
                  </CardContent>
                </Card>
              ) : (
                strips.map((strip) => (
                  <Card key={strip.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-xs">
                          {strip.media_type === 'video' ? '🎬' :
                           strip.media_type === 'audio' ? '🎵' : '🖼️'}
                        </div>
                        <div>
                          <h3 className="font-semibold">{strip.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {strip.publish_date} • {strip.media_type}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(strip.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
