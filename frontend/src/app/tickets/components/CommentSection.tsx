"use client";

import { useState } from "react";
import { Comment } from "@/services/tickets";
import { Card, Typography, Button, Popconfirm, Space, Avatar } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Text } = Typography;

interface CommentSectionProps {
  comments: Comment[];
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function CommentSection({
  comments,
  onDeleteComment,
}: CommentSectionProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      await onDeleteComment(commentId);
    } finally {
      setDeletingId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-4">
        <Text type="secondary">Nenhum comentário ainda</Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      {comments.map((comment) => (
        <Card key={comment._id} size="small" style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 12 }} />
              <div>
                <Text strong>{comment.author}</Text>
                <div>
                  <Text>{comment.content}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </Text>
                </div>
              </div>
            </div>
            <Popconfirm
              title="Tem certeza que deseja excluir este comentário?"
              onConfirm={() => handleDelete(comment._id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === comment._id}
                size="small"
              />
            </Popconfirm>
          </div>
        </Card>
      ))}
    </Space>
  );
}
