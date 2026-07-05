import React, { useState } from "react";
import { Folder, FileCode, Copy, Check, Download, ChevronDown, ChevronRight, Terminal, Info } from "lucide-react";
import { flutterFiles } from "../flutterCode";
import { FlutterCodeFile } from "../types";

export const IDEExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(flutterFiles[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    lib: true,
    "lib/core": false,
    "lib/models": false,
    "lib/repositories": false,
    "lib/providers": false,
    "lib/services": false,
    "lib/widgets": false,
    "lib/screens": false,
    android: false,
    "android/app": false,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSingleFile = (file: FlutterCodeFile) => {
    const element = document.createElement("a");
    const fileBlob = new Blob([file.content], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.path.split("/").pop() || "file";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate automated single-run bash script to construct local directories and code instantly
  const generateSetupScript = () => {
    let script = "#!/bin/bash\n# AIPassportPhotoMaker Auto-Setup Script\n";
    script += "echo 'Initializing Native Flutter Project structure...'\n";
    script += "mkdir -p assets/guides assets/clothing\n";

    flutterFiles.forEach((file) => {
      const dir = file.path.substring(0, file.path.lastIndexOf("/"));
      if (dir) {
        script += `mkdir -p "${dir}"\n`;
      }
      // Escaping content for safe bash writing
      const escapedContent = file.content
        .replace(/\\/g, "\\\\")
        .replace(/\$/g, "\\$")
        .replace(/"/g, '\\"')
        .replace(/`/g, "\\`");
      script += `cat << 'EOF' > "${file.path}"\n${file.content}\nEOF\n\n`;
    });

    script += "echo '✅ Native Flutter project generated successfully!'\n";
    script += "echo 'Run: flutter pub get && flutter run'\n";

    const element = document.createElement("a");
    const fileBlob = new Blob([script], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "setup_flutter_project.sh";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Build Virtual File Tree Nodes from flat files list
  const renderTreeFolder = (name: string, folderPath: string, children: React.ReactNode) => {
    const isExpanded = !!expandedFolders[folderPath];
    return (
      <div className="pl-2">
        <button
          onClick={() => toggleFolder(folderPath)}
          className="flex items-center gap-1.5 w-full py-1.5 text-left hover:bg-slate-50 rounded px-1.5 text-slate-700 font-mono text-[13px] transition-colors"
        >
          {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
          <Folder size={15} className="text-indigo-500 fill-indigo-500/10" />
          <span className="font-medium">{name}</span>
        </button>
        {isExpanded && <div className="border-l border-slate-100 ml-2.5 pl-1.5">{children}</div>}
      </div>
    );
  };

  const renderTreeFile = (file: FlutterCodeFile) => {
    const isSelected = selectedFile.path === file.path;
    const displayName = file.path.split("/").pop();
    return (
      <button
        key={file.path}
        onClick={() => setSelectedFile(file)}
        className={`flex items-center gap-1.5 w-full py-1.5 pl-4 text-left rounded px-1.5 font-mono text-[13px] transition-colors ${
          isSelected ? "bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600" : "hover:bg-slate-50 text-slate-500"
        }`}
      >
        <FileCode size={14} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
        <span className="truncate">{displayName}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
      {/* Workspace Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-xs text-slate-500 font-mono pl-2 border-l border-slate-200 font-medium">
            Native Android SDK (Flutter 3.x)
          </span>
        </div>
        <button
          onClick={generateSetupScript}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
          title="Download bash script to instantly generate this project structure on your computer."
        >
          <Terminal size={13} />
          <span>Export Flutter Workspace</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar Explorer */}
        <div className="w-64 border-r border-slate-200 flex flex-col bg-white select-none">
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PROJECT FILES
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {renderTreeFile(flutterFiles.find((f) => f.path === "pubspec.yaml")!)}
            {renderTreeFile(flutterFiles.find((f) => f.path === "README.md")!)}

            {/* lib directory */}
            {renderTreeFolder(
              "lib",
              "lib",
              <>
                {renderTreeFile(flutterFiles.find((f) => f.path === "lib/main.dart")!)}

                {renderTreeFolder(
                  "core",
                  "lib/core",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/core/theme.dart")!)
                )}

                {renderTreeFolder(
                  "models",
                  "lib/models",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/models/passport_photo.dart")!)
                )}

                {renderTreeFolder(
                  "repositories",
                  "lib/repositories",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/repositories/database_helper.dart")!)
                )}

                {renderTreeFolder(
                  "providers",
                  "lib/providers",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/providers/editor_provider.dart")!)
                )}

                {renderTreeFolder(
                  "services",
                  "lib/services",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/services/ai_service.dart")!)
                )}

                {renderTreeFolder(
                  "widgets",
                  "lib/widgets",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/widgets/face_guide_overlay.dart")!)
                )}

                {renderTreeFolder(
                  "screens",
                  "lib/screens",
                  renderTreeFile(flutterFiles.find((f) => f.path === "lib/screens/home_screen.dart")!)
                )}
              </>
            )}

            {/* android directory */}
            {renderTreeFolder(
              "android",
              "android",
              renderTreeFolder(
                "app",
                "android/app",
                renderTreeFile(flutterFiles.find((f) => f.path === "android/app/build.gradle")!)
              )
            )}
          </div>

          {/* Quick Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-100 m-2 rounded-xl">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Click <strong>Export Workspace</strong> to get a script that creates all folders and files automatically!
              </p>
            </div>
          </div>
        </div>

        {/* Right Tabbed Code Editor */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden min-w-0">
          {/* Editor Header / Tab Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-700 font-semibold">
              <FileCode size={13} className="text-indigo-600" />
              <span>{selectedFile.path}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={copyCodeToClipboard}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors active:scale-95 font-medium border border-slate-200/50"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadSingleFile(selectedFile)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors active:scale-95 font-medium border border-slate-200/50"
                title="Download this file individually"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Editor Body */}
          <div className="flex-1 overflow-auto font-mono text-[13px] leading-relaxed p-4 bg-[#0B0F19] select-text flex">
            {/* Ruler Line Numbers */}
            <div className="text-right text-slate-600 select-none pr-4 border-r border-slate-900/55 font-mono text-xs w-10 shrink-0 space-y-0.5">
              {selectedFile.content.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Text Code Block */}
            <pre className="pl-4 text-slate-300 overflow-x-auto whitespace-pre font-mono scrollbar-thin flex-1">
              <code className={`language-${selectedFile.language}`}>
                {selectedFile.content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
