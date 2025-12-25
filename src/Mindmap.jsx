import React, { useEffect, useState } from "react";

const STORAGE_KEY = "mindmap_nodes";

export default function Mindmap() {
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "root",
            text: "Main Topic",
            parentId: null,
            children: [],
            color: "#1f2933",
          },
        ];
  });

  const [inputMap, setInputMap] = useState({});

  const generateId = () => Math.random().toString(36).slice(2);

  /* 🔹 Persist to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  }, [nodes]);

  /* Update node text */
  const updateText = (id, text) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  /* Update node color */
  const updateColor = (id, color) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));
  };

  /* Add child */
  const addChild = (parentId) => {
    const text = inputMap[parentId];
    if (!text) return;

    const newNode = {
      id: generateId(),
      text,
      parentId,
      children: [],
      color: "#374151",
    };

    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.id === parentId ? { ...n, children: [...n.children, newNode.id] } : n
      );
      return [...updated, newNode];
    });

    setInputMap((prev) => ({ ...prev, [parentId]: "" }));
  };

  /* Recursive render */
  const renderNode = (node, level = 0) => {
    const children = node.children
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean);

    return (
      <div key={node.id} style={{ marginLeft: level * 40 }}>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateText(node.id, e.target.innerText)}
          style={{
            ...styles.node,
            background: node.color,
          }}
        >
          {node.text}
        </div>

        <div style={styles.controls}>
          <input
            className="color-picker"
            type="color"
            value={node.color}
            onChange={(e) => updateColor(node.id, e.target.value)}
          />

          <input
            value={inputMap[node.id] || ""}
            onChange={(e) =>
              setInputMap((prev) => ({
                ...prev,
                [node.id]: e.target.value,
              }))
            }
            placeholder="Add sub-topic"
            style={styles.input}
          />

          <button onClick={() => addChild(node.id)} style={styles.button}>
            +
          </button>
        </div>

        {children.length > 0 && (
          <div style={styles.children}>
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootNode = nodes.find((n) => n.parentId === null);

  return (
    <div style={styles.container}>
      <h2 style={{ color: "blue" }}>
        {" "}
        <i className="fa-solid fa-brain"></i> Mindmap
      </h2>
      {rootNode && renderNode(rootNode)}
    </div>
  );
}

/* Styles */
const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  node: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
    cursor: "text",
    marginBottom: "6px",
  },
  controls: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "4px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  children: {
    borderLeft: "2px solid #ccc",
    paddingLeft: "12px",
    marginTop: "4px",
  },
};
