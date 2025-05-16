<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  articleId: string | number
}>()

interface Comment {
  id: number
  username: string
  content: string
  created_at: string
}

const comments = ref<Comment[]>([])
const newComment = ref('')
const editingId = ref<number | null>(null)
const editingContent = ref('')
const authStore = useAuthStore()

// 댓글 불러오기
async function fetchComments() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${props.articleId}/`)
    comments.value = res.data
  } catch (err) {
    console.error('댓글 불러오기 실패:', err)
  }
}

// 댓글 등록
async function addComment() {
  const content = newComment.value.trim()
  if (!content || !authStore.token) return

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/comments/${props.articleId}/`,
      { content },
      {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      }
    )
    comments.value.unshift(res.data)
    newComment.value = ''
  } catch (err) {
    alert('댓글 등록 실패. 로그인 상태를 확인해주세요.')
  }
}

// 댓글 삭제
async function deleteComment(id: number) {
  if (!confirm('이 댓글을 삭제하시겠습니까?')) return
  if (!authStore.token) return

  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/comment/${id}/`, {
      headers: {
        Authorization: `Token ${authStore.token}`,
      },
    })
    comments.value = comments.value.filter(c => c.id !== id)
  } catch (err) {
    alert('댓글 삭제 실패')
  }
}

// 댓글 수정 시작
function startEdit(comment: Comment) {
  editingId.value = comment.id
  editingContent.value = comment.content
}

// 댓글 수정 저장
async function saveEdit(id: number) {
  const content = editingContent.value.trim()
  if (!content || !authStore.token) return

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/comment/${id}/`,
      { content },
      {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      }
    )
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) comments.value[index] = res.data
    editingId.value = null
    editingContent.value = ''
  } catch (err) {
    alert('댓글 수정 실패')
  }
}

onMounted(fetchComments)
watch(() => props.articleId, fetchComments)
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
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-800 font-medium">
            {{ comment.username }}
          </div>
          <div v-if="authStore.username === comment.username" class="flex gap-2 text-xs text-blue-600">
            <button @click="startEdit(comment)">수정</button>
            <button @click="deleteComment(comment.id)" class="text-red-500">삭제</button>
          </div>
        </div>

        <!-- 수정 중 -->
        <div v-if="editingId === comment.id" class="mt-2 space-y-2">
          <Input v-model="editingContent" />
          <div class="flex gap-2">
            <Button size="sm" @click="saveEdit(comment.id)">저장</Button>
            <Button variant="outline" size="sm" @click="editingId = null">취소</Button>
          </div>
        </div>

        <!-- 일반 보기 -->
        <div v-else class="text-sm text-gray-600 mt-1">
          {{ comment.content }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          {{ comment.created_at }}
        </div>
      </div>
    </div>
  </div>
</template>
