"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const [content, setContent] = useState<string>(value || "")

  useEffect(() => {
    setContent(value || "")
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setContent(newValue)
    onChange(newValue)
  }

  return (
    <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-0">
        <Textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your content here..."
          className="min-h-[300px] font-mono text-sm"
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <Card className="min-h-[300px] overflow-auto p-4">
          {content ? (
            <div className="prose dark:prose-invert max-w-none">{content}</div>
          ) : (
            <p className="text-gray-400">Nothing to preview</p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
