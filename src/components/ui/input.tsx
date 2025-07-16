import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  // Agregar prop específica para manejar extensiones
  cleanExtensionAttrs?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, cleanExtensionAttrs = true, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    
    React.useEffect(() => {
      const inputElement = innerRef.current || (ref as React.RefObject<HTMLInputElement>)?.current;
      
      if (!inputElement || !cleanExtensionAttrs) return;
      
      // Función para limpiar atributos de extensiones
      const cleanAttributes = () => {
        const badAttrs = ['bis_skin_checked', '__processed', 'bis_register'];
        badAttrs.forEach(attr => {
          if (inputElement.hasAttribute(attr)) {
            inputElement.removeAttribute(attr);
          }
        });
      };
      
      // Limpiar inicialmente
      cleanAttributes();
      
      // Observar cambios
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            cleanAttributes();
          }
        });
      });
      
      observer.observe(inputElement, {
        attributes: true,
        attributeFilter: ['bis_skin_checked', '__processed', 'bis_register']
      });
      
      return () => observer.disconnect();
    }, [cleanExtensionAttrs, ref]);
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={(el) => {
          // Manejar ambas refs
          if (innerRef) innerRef.current = el;
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };