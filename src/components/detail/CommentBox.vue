<!-- src/components/detail/CommentBox.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  articleId: string | number
}>()

interface Comment {
  id: number
  username: string
  content: string
  created_at: string
}

const newComment = ref('')
const comments = ref<Comment[]>([
  {
    id: 1,
    username: 'user123',
    content: '정말 흥미로운 기사네요!',
    created_at: '2025-05-15 10:24',
  },
  {
    id: 2,
    username: 'devguy',
    content: 'AI가 이렇게까지 발전했을 줄은 몰랐네요.',
    created_at: '2025-05-15 11:12',
  },
])

function addComment() {
  const content = newComment.value.trim()
  if (!content) return

  const date = new Date()
  const timestamp = date.toISOString().slice(0, 16).replace('T', ' ')

  comments.value.unshift({
    id: Date.now(),
    username: '익명',
    content,
    created_at: timestamp,
  })

  newComment.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- 입력창 -->
    <div class="flex gap-2">
      <Input
        v-model="newComment"
        placeholder="댓글을 입력하세요"
        class="flex-1"
        @keyup.enter="addComment"
      />
      <Button @click="addComment">등록</Button>
    </div>

    <!-- 댓글 리스트 -->
    <div class="space-y-3">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="border rounded p-3 bg-gray-50"
      >
        <div class="text-sm text-gray-800 font-medium">
          {{ comment.username }}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ comment.content }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          {{ comment.created_at }}
        </div>
      </div>
    </div>
  </div>
</template>
