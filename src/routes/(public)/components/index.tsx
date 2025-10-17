/**
 * Components Showcase Page
 * 
 * Ruta de demostración para visualizar todos los componentes UI del sistema.
 * 
 * Ruta: /components
 * 
 * [CITE: ARQUITECTUR_FOLDER.md] - Las rutas orquestan componentes
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { ThemeToggle } from '~/components/ui/ThemeToggle';
import { Button } from '~/components/ui/button/button';
import { Badge } from '~/components/ui/badge/badge';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion/accordion';
import { Modal } from '~/components/ui/modal/modal';
import { Toaster, toast, toastSuccess, toastError, toastWarning, toastInfo } from '~/components/ui/toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '~/components/ui/dropdown-menu/dropdown-menu';
import { Input } from '~/components/ui/input/input';
import { Label } from '~/components/ui/label/label';

export default component$(() => {
  const modalOpen = useSignal(false);
  
  // Form data para el formulario de clientes
  const customerForm = useSignal({
    nombre: '',
    apellidos: '',
    direccion: '',
    email: '',
    telefono: ''
  });
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Componentes UI</h1>
          <p class="text-muted-foreground mt-2">
            Biblioteca completa de componentes reutilizables del design system
          </p>
        </div>
        <ThemeToggle variant="floating" />
      </div>

      <div class="grid gap-8">
        {/* Botones */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Botones</h2>
          <div class="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="destructive">Error</Button>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Badges</h2>
          <div class="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Cards</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Esta es una card de ejemplo con contenido básico.</p>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Card Elevada</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card con sombra elevada para destacar contenido importante.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accordion */}
        <section>
          <h2 class="text-2xl font-semibold mb-4">Accordion</h2>
          <div class="max-w-2xl">
            <Accordion type="single" collapsible={true}>
              <AccordionItem value="item-1">
                <AccordionTrigger>¿Qué es Qwik?</AccordionTrigger>
                <AccordionContent>
                  <p>Qwik es un framework web moderno que se enfoca en la velocidad de carga y el rendimiento. Utiliza resumabilidad para cargar solo el código JavaScript necesario.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>¿Cómo funciona la resumabilidad?</AccordionTrigger>
                <AccordionContent>
                  <p>La resumabilidad permite que las aplicaciones se "despierten" instantáneamente sin necesidad de hidratación. El estado de la aplicación se serializa y se puede restaurar en cualquier momento.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>¿Qué ventajas tiene sobre otros frameworks?</AccordionTrigger>
                <AccordionContent>
                  <div class="space-y-2">
                    <p><strong>Performance:</strong> Carga instantánea sin hidratación</p>
                    <p><strong>Developer Experience:</strong> Sintaxis familiar similar a React</p>
                    <p><strong>Optimización automática:</strong> Code splitting inteligente</p>
                    <p><strong>SEO-friendly:</strong> Server-side rendering optimizado</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Card Composition - Envolviendo otros componentes */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">
            Card - Composición de Componentes
          </h2>
          
          {/* Card envolviendo Button y Badge */}
          <Card>
            <CardHeader>
              <CardTitle>Card envolviendo múltiples componentes</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <p class="text-foreground/70">
                Ejemplo de Card envolviendo diferentes componentes:
              </p>
              <div class="flex gap-3 items-center">
                <Button variant="default">Botón Default</Button>
                <Badge variant="success">Éxito</Badge>
                <Button variant="outline" size="sm">Outline</Button>
              </div>
            </CardContent>
          </Card>

          {/* Card envolviendo Modal */}
          <Card>
            <CardHeader>
              <CardTitle>Card + Modal Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-foreground/70 mb-4">
                Card puede envolver componentes complejos como Modal:
              </p>
              <Button 
                variant="default"
                onClick$={() => modalOpen.value = true}
              >
                Abrir Modal dentro de Card
              </Button>
              
              <Modal
                open={modalOpen.value}
                onClose$={$(() => {
                  modalOpen.value = false;
                })}
                title="Modal envuelto por Card"
              >
                <div class="p-6">
                  <p class="text-foreground/70">
                    Este modal está completamente envuelto por el componente Card, 
                    demostrando la flexibilidad del patrón Slot de Qwik.
                  </p>
                </div>
              </Modal>
            </CardContent>
          </Card>

          {/* Card envolviendo Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Card + Accordion Nested</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" defaultValue="card-item-1">
                <AccordionItem value="card-item-1">
                  <AccordionTrigger>
                    Accordion dentro de Card
                  </AccordionTrigger>
                  <AccordionContent>
                    Este accordion está completamente envuelto por Card, 
                    manteniendo toda su funcionalidad.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="card-item-2">
                  <AccordionTrigger>
                    Múltiples niveles de composición
                  </AccordionTrigger>
                  <AccordionContent>
                    <div class="space-y-3">
                      <p>Podemos incluso añadir más componentes aquí:</p>
                      <Badge variant="warning">Anidado profundo</Badge>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Modal Standalone */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Modal</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            {/* Modal básico */}
            <Card>
              <CardHeader>
                <CardTitle>Modal Básico</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Modal con overlay, cierre con ESC y click fuera.
                </p>
                <Button variant="default" onClick$={() => modalOpen.value = true}>
                  Abrir Modal
                </Button>
                
                <Modal
                  open={modalOpen.value}
                  onClose$={$(() => {
                    modalOpen.value = false;
                  })}
                  title="Modal de Ejemplo"
                  description="Este es un modal básico con título y descripción"
                >
                  <div class="space-y-4">
                    <p class="text-foreground/70">
                      Contenido del modal. Puedes incluir cualquier componente aquí.
                    </p>
                    <div class="flex gap-2">
                      <Button variant="default" size="sm">Acción Principal</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick$={() => modalOpen.value = false}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sonner (Toasts) */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Toast (Sonner)</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones Toast</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Sistema de notificaciones tipo toast con diferentes variantes. Ahora incluye iconos informativos en cada tipo.
                </p>
                
                <div class="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick$={() => toastInfo("Información", "Este es un mensaje informativo con icono")}
                  >
                    ⓘ Info
                  </Button>
                  
                  <Button
                    variant="success"
                    size="sm"
                    onClick$={() => toastSuccess("¡Éxito!", "La operación se completó correctamente")}
                  >
                    ✓ Success
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick$={() => toastError("Error", "Algo salió mal en la operación")}
                  >
                    ✗ Error
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick$={() => toastWarning("Advertencia", "Por favor verifica la información")}
                  >
                    ⚠ Warning
                  </Button>
                </div>
                
                <div class="mt-4 p-4 bg-muted rounded-md">
                  <p class="text-sm text-foreground/70">
                    <strong>Nota:</strong> Los toasts ahora incluyen iconos informativos automáticos y aparecen en la esquina superior derecha 
                    con auto-ocultación después de 3 segundos. Utilizan fondos sólidos en tonos 
                    claros que complementan los colores del brand y texto negro para máxima legibilidad.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Toast Personalizado</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Ejemplos de toasts con contenido personalizado.
                </p>
                
                <div class="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick$={() => toast({
                      title: "Solo título",
                    })}
                  >
                    Solo Título
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick$={() => toast({
                      title: "Notificación larga",
                      description: "Este es un ejemplo de toast con una descripción más larga para mostrar cómo se adapta el contenido automáticamente al espacio disponible"
                    })}
                  >
                    Texto Largo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Tabs</h2>
          
          <div class="grid gap-4">
            {/* Tabs básicos */}
            <Card>
              <CardHeader>
                <CardTitle>Navegación por Pestañas</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Componente para organizar contenido en pestañas navegables.
                </p>
                
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reportes</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" class="mt-6">
                    <div class="space-y-4">
                      <h3 class="text-lg font-semibold">Panel de Resumen</h3>
                      <p class="text-foreground/70">
                        Esta es la vista general del dashboard con métricas clave y estadísticas importantes.
                      </p>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-muted p-4 rounded-lg text-center">
                          <div class="text-2xl font-bold text-primary">1,234</div>
                          <div class="text-sm text-foreground/70">Usuarios Activos</div>
                        </div>
                        <div class="bg-muted p-4 rounded-lg text-center">
                          <div class="text-2xl font-bold text-success">89%</div>
                          <div class="text-sm text-foreground/70">Satisfacción</div>
                        </div>
                        <div class="bg-muted p-4 rounded-lg text-center">
                          <div class="text-2xl font-bold text-warning">456</div>
                          <div class="text-sm text-foreground/70">Tickets Abiertos</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" class="mt-6">
                    <div class="space-y-4">
                      <h3 class="text-lg font-semibold">Analytics Avanzados</h3>
                      <p class="text-foreground/70">
                        Métricas detalladas de rendimiento y uso de la aplicación.
                      </p>
                      <div class="bg-muted p-6 rounded-lg">
                        <div class="flex items-center gap-2 mb-3">
                          <Badge variant="info">Nuevo</Badge>
                          <span class="font-medium">Análisis de Comportamiento</span>
                        </div>
                        <p class="text-sm text-foreground/70">
                          Gráficos interactivos, mapas de calor y análisis de flujo de usuarios.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reports" class="mt-6">
                    <div class="space-y-4">
                      <h3 class="text-lg font-semibold">Generación de Reportes</h3>
                      <p class="text-foreground/70">
                        Crea reportes personalizados y programa envíos automáticos.
                      </p>
                      <div class="flex gap-2">
                        <Button variant="default" size="sm">Crear Reporte</Button>
                        <Button variant="outline" size="sm">Ver Plantillas</Button>
                        <Button variant="secondary" size="sm">Exportar Datos</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" class="mt-6">
                    <div class="space-y-4">
                      <h3 class="text-lg font-semibold">Centro de Notificaciones</h3>
                      <p class="text-foreground/70">
                        Configura alertas y gestiona las notificaciones del sistema.
                      </p>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div class="flex items-center gap-3">
                            <Badge variant="warning">Alerta</Badge>
                            <span class="text-sm">Uso elevado de CPU detectado</span>
                          </div>
                          <Button variant="ghost" size="sm">Configurar</Button>
                        </div>
                        <div class="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div class="flex items-center gap-3">
                            <Badge variant="success">Info</Badge>
                            <span class="text-sm">Backup completado exitosamente</span>
                          </div>
                          <Button variant="ghost" size="sm">Ver Detalles</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Tabs dentro de Card - Composición */}
            <Card>
              <CardHeader>
                <CardTitle>Tabs + Componentes Anidados</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-foreground/70 mb-4">
                  Ejemplo de Tabs conteniendo otros componentes complejos.
                </p>
                
                <Tabs defaultValue="components">
                  <TabsList>
                    <TabsTrigger value="components">Componentes</TabsTrigger>
                    <TabsTrigger value="integration">Integración</TabsTrigger>
                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="components" class="mt-6">
                    <div class="space-y-4">
                      <h4 class="font-medium">Componentes anidados en Tab</h4>
                      <div class="flex gap-2 flex-wrap">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick$={() => toast({
                            title: "Toast desde Tab",
                            description: "Componentes funcionan perfectamente dentro de Tabs"
                          })}
                        >
                          Toast desde Tab
                        </Button>
                        <Badge variant="success">Activo</Badge>
                        <Badge variant="warning">Pendiente</Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="integration" class="mt-6">
                    <div class="space-y-4">
                      <h4 class="font-medium">Accordion dentro de Tab</h4>
                      <Accordion type="single" collapsible={true}>
                        <AccordionItem value="tab-accordion-1">
                          <AccordionTrigger>¿Cómo funcionan los Tabs?</AccordionTrigger>
                          <AccordionContent>
                            Los Tabs utilizan Context API de Qwik para gestionar el estado 
                            activo sin prop drilling. Esto permite una composición limpia 
                            y mantenible.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tab-accordion-2">
                          <AccordionTrigger>Navegación con teclado</AccordionTrigger>
                          <AccordionContent>
                            Los Tabs soportan navegación con flechas izquierda/derecha 
                            y son completamente accesibles siguiendo las pautas WAI-ARIA.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" class="mt-6">
                    <div class="space-y-4">
                      <h4 class="font-medium">Configuración Avanzada</h4>
                      <div class="bg-muted p-4 rounded-lg">
                        <p class="text-sm text-foreground/70">
                          Los Tabs pueden ser totalmente personalizados con estilos CVA,
                          soportan estados disabled y pueden integrarse con cualquier 
                          sistema de routing.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Avatar */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Avatar</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Imágenes de Perfil</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Componente para mostrar imágenes de perfil con fallbacks.
                </p>
                
                <div class="space-y-4">
                  {/* Tamaños diferentes */}
                  <div>
                    <h4 class="font-medium mb-3">Diferentes tamaños</h4>
                    <div class="flex items-center gap-4">
                      <Avatar size="sm">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Usuario" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <Avatar size="default">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt="Usuario" />
                        <AvatarFallback>MD</AvatarFallback>
                      </Avatar>
                      <Avatar size="lg">
                        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Usuario" />
                        <AvatarFallback>LG</AvatarFallback>
                      </Avatar>
                      <Avatar size="xl">
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Usuario" />
                        <AvatarFallback>XL</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Fallbacks */}
                  <div>
                    <h4 class="font-medium mb-3">Con fallbacks (sin imagen)</h4>
                    <div class="flex items-center gap-4">
                      <Avatar size="default">
                        <AvatarFallback>AG</AvatarFallback>
                      </Avatar>
                      <Avatar size="default">
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <Avatar size="default">
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card class="overflow-visible">
              <CardHeader>
                <CardTitle>Avatar + DropdownMenu</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Combinación de Avatar con menú desplegable para acciones de usuario.
                </p>
                
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar size="lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" alt="Mi perfil" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configuración</DropdownMenuItem>
                    <DropdownMenuItem>Notificaciones</DropdownMenuItem>
                    <DropdownMenuItem>
                      <span class="text-destructive">Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* DropdownMenu */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">DropdownMenu</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <Card class="overflow-visible">
              <CardHeader>
                <CardTitle>Menús Desplegables</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Menús contextuales con diferentes configuraciones y estilos.
                </p>
                
                <div class="flex gap-4 flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger variant="default">
                      Menú Principal
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Dashboard</DropdownMenuItem>
                      <DropdownMenuItem>Clientes</DropdownMenuItem>
                      <DropdownMenuItem>Facturas</DropdownMenuItem>
                      <DropdownMenuItem>Reportes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger variant="outline">
                      Acciones
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick$={() => toast({
                          title: "Acción desde menú",
                          description: "Has clickeado en Editar desde el dropdown",
                          variant: "default"
                        })}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>
                        <span class="text-destructive">Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p class="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Nota:</strong> Esta Card usa <code class="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-800 rounded text-xs">overflow-visible</code> 
                    para permitir que los dropdowns se muestren correctamente.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card class="overflow-visible">
              <CardHeader>
                <CardTitle>Dropdown + Componentes</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Menús con componentes anidados y badges.
                </p>
                
                <DropdownMenu>
                  <DropdownMenuTrigger variant="secondary">
                    Configuración Avanzada
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <div class="flex items-center gap-2">
                        <Badge variant="success" size="sm">Pro</Badge>
                        <span>Funciones Premium</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div class="flex items-center gap-2">
                        <Badge variant="warning" size="sm">Beta</Badge>
                        <span>Nuevas Características</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Tema y Apariencia</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </div>
          
          {/* Demostración del problema y solución */}
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Comparativa: overflow-hidden vs overflow-visible</h3>
            
            <div class="grid md:grid-cols-2 gap-4">
              {/* Card con overflow hidden (problemática) */}
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    ❌ Con overflow-hidden
                    <Badge variant="destructive" size="sm">Problemático</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-foreground/70 text-sm mb-3">
                    El dropdown se corta por el overflow de la Card:
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger variant="outline" size="sm">
                      Dropdown Cortado
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Este contenido</DropdownMenuItem>
                      <DropdownMenuItem>No se ve completamente</DropdownMenuItem>
                      <DropdownMenuItem>Porque está cortado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
              
              {/* Card con overflow visible (solución) */}
              <Card class="overflow-visible">
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    ✅ Con overflow-visible
                    <Badge variant="success" size="sm">Correcto</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-foreground/70 text-sm mb-3">
                    El dropdown se muestra completamente:
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger variant="outline" size="sm">
                      Dropdown Completo
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Este contenido</DropdownMenuItem>
                      <DropdownMenuItem>Se ve perfectamente</DropdownMenuItem>
                      <DropdownMenuItem>Sin cortes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </div>
            
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Solución Recomendada</h4>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                Para Cards que contienen DropdownMenus, añade la clase <code class="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">overflow-visible</code> 
                o mejor aún, usa el DropdownMenu fuera del CardContent cuando sea posible.
              </p>
            </div>
          </div>
        </section>

        {/* Dialog (usando Modal) */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Dialog</h2>
          
          <div class="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Diálogos Informativos</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-foreground/70">
                  Diálogos para confirmaciones y acciones importantes.
                </p>
                
                <Button 
                  variant="destructive"
                  onClick$={() => modalOpen.value = true}
                >
                  Eliminar Cliente
                </Button>
                
                <Modal
                  open={modalOpen.value}
                  onClose$={$(() => {
                    modalOpen.value = false;
                  })}
                  title="¿Confirmar eliminación?"
                  description="Esta acción no se puede deshacer. El cliente será eliminado permanentemente."
                  variant="destructive"
                >
                  <div class="flex gap-3 justify-end pt-4">
                    <Button 
                      variant="outline" 
                      onClick$={() => modalOpen.value = false}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick$={() => {
                        modalOpen.value = false;
                        toast({
                          title: "Cliente eliminado",
                          description: "El cliente ha sido eliminado correctamente",
                          variant: "destructive"
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Formulario con Input */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground">Formulario de Clientes</h2>
          
          <Card class="overflow-visible">
            <CardHeader>
              <CardTitle>Registro de Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                class="space-y-6"
                preventdefault:submit
                onSubmit$={() => {
                  toast({
                    title: "Cliente guardado",
                    description: `Cliente ${customerForm.value.nombre} ${customerForm.value.apellidos} registrado correctamente`,
                    variant: "success"
                  });
                  // Reset form
                  customerForm.value = {
                    nombre: '',
                    apellidos: '',
                    direccion: '',
                    email: '',
                    telefono: ''
                  };
                }}
              >
                <div class="grid md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div class="space-y-2">
                    <Label for="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ingrese el nombre"
                      value={customerForm.value.nombre}
                      onInput$={(e) => {
                        customerForm.value = {
                          ...customerForm.value,
                          nombre: (e.target as HTMLInputElement).value
                        };
                      }}
                      required
                    />
                  </div>
                  
                  {/* Apellidos */}
                  <div class="space-y-2">
                    <Label for="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      type="text"
                      placeholder="Ingrese los apellidos"
                      value={customerForm.value.apellidos}
                      onInput$={(e) => {
                        customerForm.value = {
                          ...customerForm.value,
                          apellidos: (e.target as HTMLInputElement).value
                        };
                      }}
                      required
                    />
                  </div>
                </div>
                
                {/* Dirección */}
                <div class="space-y-2">
                  <Label for="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    type="text"
                    placeholder="Calle, número, ciudad, código postal"
                    value={customerForm.value.direccion}
                    onInput$={(e) => {
                      customerForm.value = {
                        ...customerForm.value,
                        direccion: (e.target as HTMLInputElement).value
                      };
                    }}
                  />
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div class="space-y-2">
                    <Label for="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={customerForm.value.email}
                      onInput$={(e) => {
                        customerForm.value = {
                          ...customerForm.value,
                          email: (e.target as HTMLInputElement).value
                        };
                      }}
                      required
                    />
                  </div>
                  
                  {/* Teléfono */}
                  <div class="space-y-2">
                    <Label for="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={customerForm.value.telefono}
                      onInput$={(e) => {
                        customerForm.value = {
                          ...customerForm.value,
                          telefono: (e.target as HTMLInputElement).value
                        };
                      }}
                    />
                  </div>
                </div>
                
                <div class="flex gap-3 pt-4">
                  <Button type="submit" variant="default">
                    Guardar Cliente
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick$={() => {
                      customerForm.value = {
                        nombre: '',
                        apellidos: '',
                        direccion: '',
                        email: '',
                        telefono: ''
                      };
                    }}
                  >
                    Limpiar Formulario
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger variant="secondary">
                      Más Acciones
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Guardar como Borrador</DropdownMenuItem>
                      <DropdownMenuItem>Importar de CSV</DropdownMenuItem>
                      <DropdownMenuItem>Ver Historial</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div class="mt-6 p-4 bg-muted rounded-lg">
                  <h4 class="font-medium mb-2">Vista previa de datos:</h4>
                  <div class="text-sm space-y-1 text-foreground/70">
                    <p><strong>Nombre:</strong> {customerForm.value.nombre || '(vacío)'}</p>
                    <p><strong>Apellidos:</strong> {customerForm.value.apellidos || '(vacío)'}</p>
                    <p><strong>Dirección:</strong> {customerForm.value.direccion || '(vacío)'}</p>
                    <p><strong>Email:</strong> {customerForm.value.email || '(vacío)'}</p>
                    <p><strong>Teléfono:</strong> {customerForm.value.telefono || '(vacío)'}</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Toaster - Contenedor global de toasts */}
      <Toaster />
    </div>
  )
});

export const head: DocumentHead = {
  title: 'Componentes UI - Qwik OnuCall',
  meta: [
    {
      name: 'description',
      content: 'Sistema de componentes UI reutilizables de Qwik OnuCall',
    },
  ],
};
