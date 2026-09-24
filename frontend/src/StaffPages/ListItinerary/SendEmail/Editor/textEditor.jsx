import React, { useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND,
  CAN_UNDO_COMMAND, CAN_REDO_COMMAND, COMMAND_PRIORITY_LOW,
  $getSelection, $isRangeSelection, $isRootOrShadowRoot, $isTextNode,
  $createParagraphNode, $getRoot, $insertNodes,
} from 'lexical';
import {
  HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode,
} from '@lexical/rich-text';
import {
  ListNode, ListItemNode, INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, RemoveFormatting, ChevronDown,
} from 'lucide-react';

/* ── Toolbar primitives ──────────────────────────────────────────── */

function ToolbarButton({ onClick, isActive, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150',
        isActive
          ? 'bg-fuchsia-500/15 text-fuchsia-300 shadow-[inset_0_0_0_1px_rgba(217,70,239,.25)]'
          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white',
        disabled
          ? 'cursor-not-allowed opacity-30 hover:bg-transparent hover:text-slate-400'
          : 'active:scale-[0.94]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-white/[0.08]" />;
}

/* ── Toolbar ─────────────────────────────────────────────────────── */

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [formats, setFormats] = useState({
    bold: false, italic: false, underline: false, strikethrough: false,
  });

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          setFormats({
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            underline: selection.hasFormat('underline'),
            strikethrough: selection.hasFormat('strikethrough'),
          });
          const anchorNode = selection.anchor.getNode();
          const element = $isRootOrShadowRoot(anchorNode)
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
          const type = element.getType();
          if (type === 'heading') setBlockType(`h${element.getTag()}`);
          else if (type === 'list')
            setBlockType(element.getListType() === 'number' ? 'number' : 'bullet');
          else if (type === 'quote') setBlockType('quote');
          else setBlockType('paragraph');
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => { setCanUndo(payload); return false; },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => { setCanRedo(payload); return false; },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  const formatText = (type) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);

  const formatBlock = (value) => {
    if (value === 'bullet' || value === 'number') {
      if (blockType === value) editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      else
        editor.dispatchCommand(
          value === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
          undefined
        );
      return;
    }
    if (blockType === 'bullet' || blockType === 'number')
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (value === 'paragraph') $setBlocksType(selection, () => $createParagraphNode());
      else if (value === 'quote') $setBlocksType(selection, () => $createQuoteNode());
      else $setBlocksType(selection, () => $createHeadingNode(value));
    });
  };

  const clearFormat = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      selection.getNodes().forEach((node) => {
        if ($isTextNode(node)) node.setFormat(0);
      });
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] bg-white/[0.015] px-2.5 py-1.5">
      <ToolbarButton
        title="Undo"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 className="h-[15px] w-[15px]" />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 className="h-[15px] w-[15px]" />
      </ToolbarButton>

      <Divider />

      {/* Block type selector */}
      <div className="relative">
        <select
          value={blockType}
          onChange={(e) => formatBlock(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="h-8 cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.03] pl-2.5 pr-7 text-[11.5px] font-medium text-slate-200 outline-none transition-all hover:border-white/[0.14] hover:bg-white/[0.05] focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/20"
        >
          <option value="paragraph" className="bg-slate-900">Normal text</option>
          <option value="h2" className="bg-slate-900">Heading 2</option>
          <option value="h3" className="bg-slate-900">Heading 3</option>
          <option value="quote" className="bg-slate-900">Quote</option>
          <option value="bullet" className="bg-slate-900">Bullet list</option>
          <option value="number" className="bg-slate-900">Numbered list</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      </div>

      <Divider />

      <ToolbarButton title="Bold" isActive={formats.bold} onClick={() => formatText('bold')}>
        <Bold className="h-[15px] w-[15px]" strokeWidth={2.4} />
      </ToolbarButton>
      <ToolbarButton title="Italic" isActive={formats.italic} onClick={() => formatText('italic')}>
        <Italic className="h-[15px] w-[15px]" strokeWidth={2.4} />
      </ToolbarButton>
      <ToolbarButton title="Underline" isActive={formats.underline} onClick={() => formatText('underline')}>
        <Underline className="h-[15px] w-[15px]" strokeWidth={2.4} />
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" isActive={formats.strikethrough} onClick={() => formatText('strikethrough')}>
        <Strikethrough className="h-[15px] w-[15px]" strokeWidth={2.4} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Bullet list" isActive={blockType === 'bullet'} onClick={() => formatBlock('bullet')}>
        <List className="h-[15px] w-[15px]" />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" isActive={blockType === 'number'} onClick={() => formatBlock('number')}>
        <ListOrdered className="h-[15px] w-[15px]" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Clear formatting" onClick={clearFormat}>
        <RemoveFormatting className="h-[15px] w-[15px]" />
      </ToolbarButton>
    </div>
  );
}

/* ── Lexical theme (dark) ────────────────────────────────────────── */

const editorConfig = {
  namespace: 'EmailEditor',
  theme: {
    paragraph: 'mb-3 leading-7 text-[13.5px] text-slate-200',
    heading: {
      h2: 'mt-5 mb-2 text-xl font-semibold tracking-tight text-white',
      h3: 'mt-4 mb-2 text-lg font-semibold tracking-tight text-white',
    },
    quote:
      'my-3 border-l-2 border-fuchsia-500/40 pl-4 italic text-slate-300',
    list: {
      ul: 'mb-3 ml-5 list-disc marker:text-fuchsia-400/60',
      ol: 'mb-3 ml-5 list-decimal marker:text-fuchsia-400/60',
      listitem: 'my-1 leading-7 text-[13.5px] text-slate-200',
    },
    text: {
      bold: 'font-bold text-white',
      italic: 'italic',
      underline: 'underline decoration-fuchsia-400/60 underline-offset-2',
      strikethrough: 'line-through text-slate-500',
    },
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  onError: (error) => console.error('[Lexical Error]', error),
};

/* ── Controlled editor ───────────────────────────────────────────── */

function RichTextEditor({ value, onChange, placeholder }) {
  const [editor] = useLexicalComposerContext();
  const lastHtmlRef = useRef(value ?? '');

  // External value → editor (template changes, initial hydration)
  useEffect(() => {
    const incoming = value ?? '';
    if (incoming === lastHtmlRef.current) return;
    lastHtmlRef.current = incoming;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      if (!incoming) {
        root.append($createParagraphNode());
        return;
      }
      const parser = new DOMParser();
      const dom = parser.parseFromString(incoming, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      root.select();
      $insertNodes(nodes);
    });
  }, [value, editor]);

  // Editor → parent (user typing)
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        if (html !== lastHtmlRef.current) {
          lastHtmlRef.current = html;
          onChange(html);
        }
      });
    });
  }, [editor, onChange]);

  return (
    <div className="flex h-full flex-col">
      <ToolbarPlugin />

      <div className="lux-scrollbar relative min-h-[260px] flex-1 overflow-y-auto p-5">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[220px] text-[13.5px] leading-7 text-slate-200 caret-fuchsia-400 outline-none" />
          }
          placeholder={
            <div className="pointer-events-none absolute left-5 top-5 select-none text-[13.5px] italic text-slate-600">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      <HistoryPlugin />
      <ListPlugin />
    </div>
  );
}

/* ── Public wrapper ──────────────────────────────────────────────── */

export function EmailEditorWrapper({ value, onChange, placeholder }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextEditor value={value} onChange={onChange} placeholder={placeholder} />
    </LexicalComposer>
  );
}