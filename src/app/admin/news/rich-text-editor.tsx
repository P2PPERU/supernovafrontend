'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Link,
  Heading2,
  Code,
  Eye,
  Edit
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  preview?: boolean;
  error?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  preview = false,
  error = false
}: RichTextEditorProps) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Función para aplicar formato
  const applyFormat = (format: string, value1?: string, value2?: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        newCursorPos = start + 3;
        break;
      case 'h2':
        newText = `\n## ${selectedText}\n`;
        newCursorPos = start + 4;
        break;
      case 'quote':
        newText = `\n> ${selectedText}\n`;
        newCursorPos = start + 3;
        break;
      case 'ul':
        newText = `\n- ${selectedText}\n`;
        newCursorPos = start + 3;
        break;
      case 'ol':
        newText = `\n1. ${selectedText}\n`;
        newCursorPos = start + 4;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        newCursorPos = start + 1;
        break;
      case 'link':
        const url = prompt('Ingresa la URL:');
        if (url) {
          newText = `[${selectedText}](${url})`;
          newCursorPos = start + 1;
        } else {
          return;
        }
        break;
      default:
        return;
    }

    const finalText = beforeText + newText + afterText;
    onChange(finalText);

    // Restaurar el foco y la selección
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
    }, 0);
  };

  // Convertir Markdown básico a HTML para preview
  const markdownToHtml = (text: string) => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>');
    
    // Lists - CORREGIDO sin usar la bandera 's'
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    // Envolver elementos li consecutivos en ul
    html = html.replace(/(<li>.*?<\/li>\n?)(<li>.*?<\/li>\n?)+/gi, function(match) {
      return '<ul>' + match + '</ul>';
    });
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    // Code
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic">$1</blockquote>');
    
    return html;
  };

  const toolbarButtons = [
    { icon: Bold, format: 'bold', tooltip: 'Negrita' },
    { icon: Italic, format: 'italic', tooltip: 'Cursiva' },
    { icon: Underline, format: 'underline', tooltip: 'Subrayado' },
    { icon: Heading2, format: 'h2', tooltip: 'Título' },
    { icon: Quote, format: 'quote', tooltip: 'Cita' },
    { icon: List, format: 'ul', tooltip: 'Lista' },
    { icon: ListOrdered, format: 'ol', tooltip: 'Lista numerada' },
    { icon: Code, format: 'code', tooltip: 'Código' },
    { icon: Link, format: 'link', tooltip: 'Enlace' },
  ];

  if (preview) {
    return (
      <Card className="p-6">
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-t-lg bg-gray-50 dark:bg-gray-900">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.format}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyFormat(button.format)}
              className="h-8 w-8 p-0"
              title={button.tooltip}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <div className="ml-auto text-xs text-muted-foreground">
          Markdown soportado
        </div>
      </div>

      {/* Editor */}
      <Textarea
        id="content-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          min-h-[400px] font-mono text-sm rounded-t-none
          ${error ? 'border-red-500' : ''}
        `}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelection({ start: target.selectionStart, end: target.selectionEnd });
        }}
      />

      {/* Character count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{value.length} caracteres</span>
        <span>~{Math.ceil(value.length / 1000)} min de lectura</span>
      </div>
    </div>
  );
}