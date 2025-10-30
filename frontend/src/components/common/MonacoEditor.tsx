import React, { useRef, useEffect } from 'react';
import Editor, { EditorProps, Monaco } from '@monaco-editor/react';
import { Card, Button, Space, Tooltip, message } from 'antd';
import {
    CopyOutlined,
    DownloadOutlined,
    FullscreenOutlined,
    CompressOutlined,
    FormatPainterOutlined
} from '@ant-design/icons';
import Loading from './Loading';

export interface MonacoEditorProps extends Omit<EditorProps, 'loading'> {
    title?: string;
    showToolbar?: boolean;
    showCopyButton?: boolean;
    showDownloadButton?: boolean;
    showFullscreenButton?: boolean;
    showFormatButton?: boolean;
    downloadFileName?: string;
    onCopy?: (content: string) => void;
    onDownload?: (content: string, fileName: string) => void;
    onFormat?: (content: string) => string;
    className?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
    title,
    showToolbar = true,
    showCopyButton = true,
    showDownloadButton = true,
    showFullscreenButton = true,
    showFormatButton = true,
    downloadFileName = 'document.md',
    onCopy,
    onDownload,
    onFormat,
    className,
    value = '',
    language = 'markdown',
    theme = 'vs-dark',
    height = 400,
    options = {},
    ...editorProps
}) => {
    const editorRef = useRef<any>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // 默认编辑器选项
    const defaultOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 20,
        wordWrap: 'on' as const,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderLineHighlight: 'line' as const,
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line' as const,
        ...options
    };

    // 编辑器挂载时的回调
    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;

        // 配置 Markdown 语言支持
        if (language === 'markdown') {
            monaco.languages.setMonarchTokensProvider('markdown', {
                tokenizer: {
                    root: [
                        [/^#{1,6}\s.*$/, 'custom-header'],
                        [/^\*\*.*\*\*/, 'custom-bold'],
                        [/^\*.*\*/, 'custom-italic'],
                        [/^```[\s\S]*?```/, 'custom-code-block'],
                        [/^`.*`/, 'custom-inline-code'],
                        [/^\>.*$/, 'custom-quote'],
                        [/^\-\s.*$/, 'custom-list'],
                        [/^\d+\.\s.*$/, 'custom-ordered-list']
                    ]
                }
            });

            // 定义自定义主题
            monaco.editor.defineTheme('markdown-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'custom-header', foreground: '569cd6', fontStyle: 'bold' },
                    { token: 'custom-bold', foreground: 'dcdcaa', fontStyle: 'bold' },
                    { token: 'custom-italic', foreground: 'ce9178', fontStyle: 'italic' },
                    { token: 'custom-code-block', foreground: '608b4e', background: '1e1e1e' },
                    { token: 'custom-inline-code', foreground: 'ce9178' },
                    { token: 'custom-quote', foreground: '6a9955', fontStyle: 'italic' },
                    { token: 'custom-list', foreground: 'c586c0' },
                    { token: 'custom-ordered-list', foreground: 'c586c0' }
                ],
                colors: {
                    'editor.background': '#1e1e1e',
                    'editor.foreground': '#d4d4d4'
                }
            });
        }

        // 调用原始的 onMount 回调
        editorProps.onMount?.(editor, monaco);
    };

    // 复制内容
    const handleCopy = async () => {
        const content = editorRef.current?.getValue() || '';
        try {
            await navigator.clipboard.writeText(content);
            message.success('内容已复制到剪贴板');
            onCopy?.(content);
        } catch (error) {
            message.error('复制失败');
        }
    };

    // 下载文件
    const handleDownload = () => {
        const content = editorRef.current?.getValue() || '';
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        message.success('文件已下载');
        onDownload?.(content, downloadFileName);
    };

    // 格式化内容
    const handleFormat = () => {
        const content = editorRef.current?.getValue() || '';
        if (onFormat) {
            const formattedContent = onFormat(content);
            editorRef.current?.setValue(formattedContent);
            message.success('内容已格式化');
        } else {
            // 默认格式化（触发编辑器的格式化功能）
            editorRef.current?.getAction('editor.action.formatDocument')?.run();
        }
    };

    // 切换全屏
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // 全屏样式
    const fullscreenStyle = isFullscreen ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#1e1e1e'
    } : {};

    return (
        <Card
            title={title}
            className={className}
            style={fullscreenStyle}
            extra={
                showToolbar && (
                    <Space>
                        {showCopyButton && (
                            <Tooltip title='复制内容'>
                                <Button
                                    type='text'
                                    icon={<CopyOutlined />}
                                    onClick={handleCopy}
                                />
                            </Tooltip>
                        )}

                        {showFormatButton && (
                            <Tooltip title='格式化'>
                                <Button
                                    type='text'
                                    icon={<FormatPainterOutlined />}
                                    onClick={handleFormat}
                                />
                            </Tooltip>
                        )}

                        {showDownloadButton && (
                            <Tooltip title='下载文件'>
                                <Button
                                    type='text'
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownload}
                                />
                            </Tooltip>
                        )}

                        {showFullscreenButton && (
                            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
                                <Button
                                    type='text'
                                    icon={isFullscreen ? <CompressOutlined /> : <FullscreenOutlined />}
                                    onClick={toggleFullscreen}
                                />
                            </Tooltip>
                        )}
                    </Space>
                )
            }
        >
            <div style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
                <Editor
                    {...editorProps}
                    value={value}
                    language={language}
                    theme={language === 'markdown' ? 'markdown-theme' : theme}
                    height='100%'
                    options={defaultOptions}
                    onMount={handleEditorDidMount}
                    loading={<Loading text='编辑器加载中...' />}
                />
            </div>
        </Card>
    );
};

export default MonacoEditor;
