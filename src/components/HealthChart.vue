  <div class="relative w-full h-full flex items-center justify-center">
    <!-- 健康度圆环 -->
    <svg class="w-full h-full transform -rotate-90">
      <!-- 背景圆环 -->
      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        stroke="currentColor"
        stroke-width="8"
        fill="none"
        class="text-gray-100"
      />
      <!-- 进度圆环 -->
      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        stroke="currentColor"
        stroke-width="8"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="text-primary transition-all duration-300"
      />
    </svg>

    <!-- 中心文字 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-4xl font-bold text-primary">{{ score }}</span>
      <span class="text-sm text-gray-500">{{ t('dashboard.healthScore') }}</span>
    </div>
  </div> 