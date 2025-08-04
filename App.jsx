import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
// Removed direct imports for highlight.js as they will be loaded from a CDN.
import { 
    Bold, Italic, Link, Code, Eye, Edit, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Columns2, BookOpen, Code2
} from 'lucide-react';

// Main App Component
const App = () => {
  const [markdown, setMarkdown] = useState(`
# Welcome to the Professional Markdown Editor!

This editor is now packed with professional features and a polished UI.

## Key Upgrades:
- **Syntax Highlighting**: Code blocks are now beautifully rendered.
- **View Modes**: Switch between Editor, Split, and Preview modes.
- **Expanded Toolbar**: More formatting options at your fingertips.
- **Status Bar**: Keep track of your word and character count.

### Check out this highlighted code:
\`\`\`javascript
// Your code will look this good!
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Developer');
\`\`\`

> Use the toolbar to add blockquotes, lists, and more!
  `);

  const [viewMode, setViewMode] = useState('split'); // 'editor', 'split', 'preview'
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef(null);

  // This effect runs once on component mount to load highlight.js and configure marked.
  useEffect(() => {
    const loadScript = (src, onLoad) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onLoad;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', () => {
      if (window.hljs) {
        marked.setOptions({
          highlight: function(code, lang) {
            const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
            return window.hljs.highlight(code, { language }).value;
          },
          langPrefix: 'hljs language-',
          gfm: true,
          breaks: true,
        });
        setMarkdown(md => md + ' ');
        setMarkdown(md => md.trim());
      }
    });
  }, []);

  useEffect(() => {
    const words = markdown.match(/\b\w+\b/g) || [];
    setWordCount(words.length);
    setCharCount(markdown.length);
  }, [markdown]);

  const handleMarkdownChange = (event) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownText = () => ({
    __html: marked(markdown, { sanitize: true }),
  });

  const applyStyle = (style, level = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    let newText;
    let prefix = '';
    switch (style) {
      case 'heading': prefix = '#'.repeat(level) + ' '; newText = `${prefix}${selectedText}`; break;
      case 'bold': newText = `**${selectedText}**`; break;
      case 'italic': newText = `*${selectedText}*`; break;
      case 'link': newText = `[${selectedText}](url)`; break;
      case 'quote': prefix = '> '; newText = `${prefix}${selectedText}`; break;
      case 'code': newText = `\`${selectedText}\``; break;
      case 'codeBlock': newText = `\`\`\`javascript\n${selectedText}\n\`\`\``; break;
      case 'ul': prefix = '- '; newText = selectedText.split('\n').map(line => `${prefix}${line}`).join('\n'); break;
      case 'ol': newText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n'); break;
      default: newText = selectedText;
    }
    const updatedMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(updatedMarkdown);
    textarea.focus();
    setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + newText.length; }, 0);
  };

  const editorVisible = viewMode === 'editor' || viewMode === 'split';
  const previewVisible = viewMode === 'preview' || viewMode === 'split';

  // All CSS styles are now included in this style tag
  const styles = `
    /* Import highlight.js theme */
    @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css');

    :root {
      --bg-dark: #111827; --bg-medium: #1f2937; --bg-light: #374151;
      --text-light: #d1d5db; --text-dark: #9ca3af; --cyan: #06b6d4;
      --cyan-active: #0891b2; --border-color: #374151;
    }
    body { font-family: sans-serif; margin: 0; }
    .app-container { display: flex; flex-direction: column; height: 100vh; background-color: var(--bg-dark); color: var(--text-light); }
    .app-header { display: flex; justify-content: space-between; align-items: center; background-color: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px); box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); padding: 0.75rem; z-index: 10; border-bottom: 1px solid var(--border-color); }
    .app-title { font-size: 1.25rem; font-weight: bold; color: var(--cyan); letter-spacing: 0.025em; margin-left: 1rem; }
    .view-mode-group { display: flex; align-items: center; gap: 0.5rem; background-color: var(--bg-medium); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.25rem; }
    .view-mode-button { display: flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; transition: background-color 0.2s, color 0.2s; border: none; background-color: transparent; color: var(--text-light); cursor: pointer; }
    .view-mode-button.active { background-color: var(--cyan); color: white; }
    .view-mode-button:not(.active):hover { background-color: var(--bg-light); }
    .main-content { display: flex; flex-grow: 1; overflow: hidden; }
    .pane { display: flex; flex-direction: column; height: 100%; width: 100%; }
    .pane-editor { background-color: var(--bg-medium); }
    .pane-preview { background-color: var(--bg-dark); }
    .toolbar { display: flex; justify-content: flex-start; align-items: center; background-color: var(--bg-dark); padding: 0.5rem; border-bottom: 1px solid var(--border-color); overflow-x: auto; }
    .toolbar-divider { width: 1px; height: 1.5rem; background-color: var(--border-color); margin: 0 0.5rem; }
    .editor-textarea { flex-grow: 1; padding: 1.5rem; background-color: var(--bg-medium); color: var(--text-light); resize: none; border: none; outline: none; font-family: monospace; font-size: 1rem; line-height: 1.7; }
    .editor-textarea:focus { box-shadow: inset 0 0 0 2px var(--cyan-active); }
    .preview-header { display: flex; align-items: center; gap: 0.5rem; background-color: var(--bg-dark); padding: 0.75rem; border-bottom: 1px solid var(--border-color); font-size: 1.125rem; font-weight: 600; color: var(--text-light); height: 33px; }
    .preview-content { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
    .preview-content h1, .preview-content h2, .preview-content h3 { color: var(--cyan); }
    .preview-content a { color: var(--cyan); text-underline-offset: 2px; }
    .preview-content a:hover { color: #22d3ee; }
    .preview-content strong { color: white; }
    .preview-content blockquote { border-left: 4px solid var(--cyan); color: var(--text-dark); padding-left: 1rem; margin-left: 0; }
    .preview-content code:not(pre > code) { font-family: monospace; color: #f59e0b; background-color: rgba(55, 65, 81, 0.5); border-radius: 0.25rem; padding: 0.25rem 0.375rem; }
    .preview-content pre { border: 1px solid var(--border-color); background-color: rgba(31, 41, 55, 0.5); border-radius: 0.5rem; padding: 1rem; }
    .app-footer { background-color: var(--bg-dark); border-top: 1px solid var(--border-color); padding: 0.5rem; font-size: 0.875rem; color: var(--text-dark); display: flex; justify-content: flex-end; align-items: center; gap: 1.5rem; padding-right: 1rem; }
    @media (max-width: 768px) { .main-content { flex-direction: column; } .pane { height: 50%; } .view-mode-button span { display: none; } }
  `;
  
  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Markdown Pro</h1>
          <div className="view-mode-group">
            <ViewModeButton icon={<Edit size={18}/>} label="Editor" isActive={viewMode === 'editor'} onClick={() => setViewMode('editor')} />
            <ViewModeButton icon={<Columns2 size={18}/>} label="Split" isActive={viewMode === 'split'} onClick={() => setViewMode('split')} />
            <ViewModeButton icon={<BookOpen size={18}/>} label="Preview" isActive={viewMode === 'preview'} onClick={() => setViewMode('preview')} />
          </div>
        </header>

        <div className="main-content">
          {editorVisible && (
            <div className={`pane pane-editor ${viewMode === 'split' ? 'md:w-1/2' : 'md:w-full'}`}>
              <div className="toolbar">
                <ToolbarButton icon={<Heading1 size={20} />} onClick={() => applyStyle('heading', 1)} tooltip="Heading 1" />
                <ToolbarButton icon={<Heading2 size={20} />} onClick={() => applyStyle('heading', 2)} tooltip="Heading 2" />
                <ToolbarButton icon={<Heading3 size={20} />} onClick={() => applyStyle('heading', 3)} tooltip="Heading 3" />
                <div className="toolbar-divider"></div>
                <ToolbarButton icon={<Bold size={20} />} onClick={() => applyStyle('bold')} tooltip="Bold" />
                <ToolbarButton icon={<Italic size={20} />} onClick={() => applyStyle('italic')} tooltip="Italic" />
                <div className="toolbar-divider"></div>
                <ToolbarButton icon={<Quote size={20} />} onClick={() => applyStyle('quote')} tooltip="Blockquote" />
                <ToolbarButton icon={<Link size={20} />} onClick={() => applyStyle('link')} tooltip="Link" />
                <ToolbarButton icon={<List size={20} />} onClick={() => applyStyle('ul')} tooltip="Unordered List" />
                <ToolbarButton icon={<ListOrdered size={20} />} onClick={() => applyStyle('ol')} tooltip="Ordered List" />
                <div className="toolbar-divider"></div>
                <ToolbarButton icon={<Code size={20} />} onClick={() => applyStyle('code')} tooltip="Inline Code" />
                <ToolbarButton icon={<Code2 size={20} />} onClick={() => applyStyle('codeBlock')} tooltip="Code Block" />
              </div>
              <textarea ref={editorRef} className="editor-textarea" value={markdown} onChange={handleMarkdownChange} placeholder="Start writing..." />
            </div>
          )}

          {previewVisible && (
            <div className={`pane pane-preview ${viewMode === 'split' ? 'md:w-1/2' : 'md:w-full'}`}>
              <div className="preview-header"><Eye size={20} color="#06b6d4"/><span>Preview</span></div>
              <div className="preview-content" dangerouslySetInnerHTML={getMarkdownText()} />
            </div>
          )}
        </div>
        <footer className="app-footer">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </footer>
      </div>
    </>
  );
};

const ToolbarButton = ({ icon, onClick, tooltip }) => {
    const btnStyles = `
        .toolbar-btn { position: relative; background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: 0.25rem; color: #9ca3af; transition: background-color 0.2s, color 0.2s; }
        .toolbar-btn:hover { background-color: #374151; color: white; }
        .tooltip { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 0.5rem; background-color: #1f2937; color: white; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; white-space: nowrap; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 20; }
        .toolbar-btn:hover .tooltip { opacity: 1; }
    `;
    return (
        <>
            <style>{btnStyles}</style>
            <button onClick={onClick} className="toolbar-btn" aria-label={tooltip}>
                {icon}
                <span className="tooltip">{tooltip}</span>
            </button>
        </>
    );
};

const ViewModeButton = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`view-mode-button ${isActive ? 'active' : ''}`}>
        {icon}
        <span style={{ display: 'none' }} className="sm-inline">{label}</span>
    </button>
);

export default App;
