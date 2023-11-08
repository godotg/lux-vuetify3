<script setup lang="ts">
import {useDisplay} from "vuetify";

const {mobile, width, height} = useDisplay();

const chatUrls = [{
  "title": "讯飞星火认知大模型",
  "description": "由科大讯飞推出的新一代认知智能大模型，拥有跨领域的知识和语言理解能力，能够基于自然对话方式理解与执行任务，提供语言理解、知识问答、逻辑推理、数学题解答、代码理解与编写等多种能力。",
  "url": "https://xinghuo.xfyun.cn",
  "image": "xinghuo.xfyun.cn.png"
}, {
  "title": "腾讯混元",
  "description": "腾讯混元大模型是由腾讯研发的大语言模型，具备跨领域知识和自然语言理解能力，实现基于人机自然语言对话的方式，理解用户指令并执行任务，帮助用户实现人获取信息，知识和灵感。",
  "url": "https://hunyuan.tencent.com",
  "image": "hunyuan.tencent.com.png"
}, {
  "title": "通义千问",
  "description": "通义千问，阿里新AI语言模型",
  "url": "https://qianwen.aliyun.com",
  "image": "qianwen.aliyun.com.png"
}, {
  "title": "文心一言",
  "description": "百度全新一代知识增强大语言模型，文心大模型家族的新成员，能够与人对话互动，回答问题，协助创作，高效便捷地帮助人们获取信息、知识和灵感。",
  "url": "https://yiyan.baidu.com",
  "image": "1687852872-Pasted.png"
}, {
  "title": "网易云AI智能助手",
  "description": "网易云AI聊天机器人",
  "url": "https://ke.study.163.com/nextChat",
  "image": "ke.study.163.com.png"
}, {
  "title": "豆包 字节跳动Ai",
  "description": "你好，我是豆包！作为你的 AI 朋友，你可以向我寻求建议、答案，聊你想聊的任何事情。字节跳动Ai产品。",
  "url": "https://www.doubao.com",
  "image": "1692332410-Pasted.png"
}, {
  "title": "天工AI助手",
  "description": "天工AI助手 — 双千亿级大语言模型",
  "url": "https://neice.tiangong.cn/login",
  "image": "neice.tiangong.cn.png"
}, {
  "title": "360智脑",
  "description": "拥有独特的语言理解能力，通过实时对话，解答疑惑、探索灵感，用AI技术帮人类打开智慧的大门",
  "url": "https://chat.360.com",
  "image": "1698637929-Pasted.png"
}, {
  "title": "Pi",
  "description": "生成式人工智能聊天机器人。一个善良和支持的伴侣，Pi AI 能够以完全自然的方式与你进行讨论，询问，提供反馈，并与之交流知识。",
  "url": "https://pi.ai/talk",
  "image": "pi.ai.png"
}, {
  "title": "Claude",
  "description": "Claude是下一代人工智能助手，基于 Anthropic 对训练有用、诚实且无害的人工智能系统的研究。",
  "url": "https://claude.ai/login",
  "image": "1689325131-Pasted.png"
}, {
  "title": "智谱清言 ChatGLM",
  "description": "中国版对话语言模型，与GLM大模型进行对话。",
  "url": "https://chatglm.cn",
  "image": "chatglm.cn.png"
}, {
  "title": "You",
  "description": "AI搜索引擎",
  "url": "https://you.com",
  "image": "you.com.png"
}, {
  "title": "Copilot Hub",
  "description": "Copilot Hub 是一个帮助你基于私有数据创建智能知识库 &amp; 人格化 AI 的平台。你可以基于文档、网站、Notion database 或其他数据源在几分钟内创建一个自定义的 ChatGPT。",
  "url": "https://app.copilothub.ai/home",
  "image": "1681395717-Pasted.png"
}, {
  "title": "ChatGPT",
  "description": "聊天生成型预训练变换模型简称ChatGPT，是由OpenAI开发的一个人工智能聊天机器人程序，于2022年11月推出。",
  "url": "https://chat.openai.com",
  "image": "chat.openai.com.png"
}, {
  "title": "New Bing",
  "description": "Get product information, support, and news from Microsoft.",
  "url": "https://www.microsoft.com/en-us/bing",
  "image": "1680236640-Pasted.png"
}, {
  "title": "Google Bard",
  "description": "Google Bard是基于相同技术的实验，让你与生成式人工智能进行协作。作为一个富有创造力和有益的合作者，Bard 可以让你的想象力超级发挥，提高生产力，并帮助你实现你的想法。",
  "url": "https://bard.google.com",
  "image": "1680228896-Pasted.png"
}];

const imageUrls = [{
  "title": "触手AI",
  "description": "触手AI绘画-让创作更简单",
  "url": "http://douchu.ai/login?inviteCode=796560",
  "image": "douchu.ai.png"
}, {
  "title": "通义万相",
  "description": "刻削生千变，丹青图“万相”。我是通义万相，一个不断进化的AI绘画创作模型",
  "url": "https://wanxiang.aliyun.com",
  "image": "wanxiang.aliyun.com.png"
}, {
  "title": "AI Random Image AI随机图片",
  "description": "一键随机生成美少女形象艺术。无须输入关键词，一键生成优质图片",
  "url": "https://airandomimage.art",
  "image": "1696741214-Pasted.png"
}, {
  "title": "LiblibAI·哩布哩布AI",
  "description": "原创AI模型分享社区，这里有最新、最热门的模型素材，10万+模型免费下载。欢迎每一位创作者加入，分享你的作品。与中国原创模型作者交流,共同探索AI绘画。",
  "url": "https://www.liblib.ai",
  "image": "1696740605-Pasted.png"
}, {
  "title": "简单AI",
  "description": "简单A是搜狐最新推出的智能图片生成平台和社区，是一个适合小白直接上手的AJ图片生成工具，提供文生图和图生图两种模式，上手简单，且生成质量较好。目前，用户可以通过简单Al每日免费生成 10 张图片。同时，该平台还提供用户作品分享社区、创作同款、提示词参考等功能。",
  "url": "https://ai.sohu.com",
  "image": "ai.sohu.com.png"
}, {
  "title": "BlueWillow",
  "description": "BlueWillow 是一款免费的 AI 艺术作品生成器，可创建令人惊叹的 AI 生成图像。美丽、独特且鼓舞人心的人工智能图片、照片和艺术触手可及。免费人工智能绘画替代品。",
  "url": "https://www.bluewillow.ai",
  "image": "www.bluewillow.ai.png"
}, {
  "title": "Fusion Brain",
  "description": "AI绘画，使用Kandinsky在几秒钟内将想法变成图像，支持无限画布。",
  "url": "https://fusionbrain.ai/en",
  "image": "fusionbrain.ai.png"
}, {
  "title": "WHEE",
  "description": "AI视觉创作的灵感激发器",
  "url": "https://www.whee.com",
  "image": "www.whee.com.png"
}, {
  "title": "NovelAI",
  "description": "借助领先的动漫艺术 AI 和其他 AI 模型，使用强大的图像模型来描绘故事中的人物和时刻。",
  "url": "https://novelai.net",
  "image": "novelai.net.png"
}, {
  "title": "Stable Diffusion",
  "description": "它可以在几秒钟内创建您可以想象的任何东西的高质量图像——只需输入文本提示并点击生成。",
  "url": "https://stablediffusionweb.com/#demo",
  "image": "stablediffusionweb.com.png"
}, {
  "title": "Stockimg AI",
  "description": "团队AI图像生成-您可以轻松生成 AI Logo，AI书籍封面，AI海报等- Stockimg AI",
  "url": "https://stockimg.ai",
  "image": "stockimg.ai.png"
}, {
  "title": "Stability",
  "description": "AI by the people for the people",
  "url": "https://stability.ai",
  "image": "stability.ai.png"
}, {
  "title": "Midjourney",
  "description": "Midjourney是一个由同名研究实验室开发的人工智能程式，可根据文本生成图像，于2022年7月12日进入公开测试阶段，使用者可透过Discord的机器人指令进行操作。",
  "url": "https://www.midjourney.com",
  "image": "www.midjourney.com.png"
}, {
  "title": "Bing 映像创建器",
  "description": "图像创建器是一款产品，可帮助用户使用 DALL-E 生成 AI 映像。得到文本提示后，AI 将生成一组与该提示匹配的图像。",
  "url": "http://bing.com/create",
  "image": "bing.com.png"
}, {
  "title": "Getimg",
  "description": "getimg.ai 是一套神奇的人工智能工具。按比例生成原始图像，修改照片，将图片扩展到原始边界之外，或创建自定义AI模型。",
  "url": "https://getimg.ai",
  "image": "getimg.ai.png"
}, {
  "title": "文心一格",
  "description": "文心一格，AI艺术和创意辅助平台，依托飞桨、文心大模型的技术创新推出的“AI作画”产品，可轻松驾驭多种风格，人人皆可“一语成画”",
  "url": "https://yige.baidu.com",
  "image": "yige.baidu.com.png"
}, {
  "title": "神采Prome AI",
  "description": "让创意照进现实",
  "url": "https://www.ishencai.com",
  "image": "www.ishencai.com.png"
}, {
  "title": "Playground AI",
  "description": "Playground AI是一个免费使用的在线AI图像创建器。使用它来创建艺术，社交媒体帖子，演示文稿，海报，视频，徽标等。",
  "url": "https://playgroundai.com",
  "image": "playgroundai.com.png"
}, {
  "title": "Civitai",
  "description": "Civitai 是一个让人们可以轻松分享和发现 AI 艺术创作资源的平台。",
  "url": "https://civitai.com",
  "image": "civitai.com.png"
}, {
  "title": "6pen Art",
  "description": "6pen 是一个使用 AI 技术，利用文本生成绘画作品的产品，这意味着，你可以仅仅通过文字描述画面内容，风格，就可以得到画面",
  "url": "https://6pen.art",
  "image": "6pen.art.png"
}, {
  "title": "🤖AI Art Generator",
  "description": "使用人工智能的力量在几秒钟内创作出令人惊叹的艺术作品。现在就试试！",
  "url": "https://toolsdar.cn/sites/4560.html?menu-id=2331&mininav-id=4543",
  "image": "creator.nightcafe.studio.png"
}, {
  "title": "Magic Studio",
  "description": "使用 AI 创建或编辑你的图片",
  "url": "https://magicstudio.com/?via=c",
  "image": "magicstudio.com.png"
}, {
  "title": "白昼AI",
  "description": "Midjourney绘图中文关键词，免费GPT3.5 支持GPT4.0",
  "url": "https://ai6.bz007.cn",
  "image": "1687256521-Pasted.png"
}, {
  "title": "提厅提示词",
  "description": "提示词正成为主流的AI使用方式，提厅提示词™是一个提示词交易市场，您可以在市场中选购创作者制作的提示词，从而获得最佳的AI生成效果",
  "url": "https://too.dittin.cn",
  "image": "1686809696-Pasted.png"
}];

const audioUrls = [{
  "title": "ElevenLabs",
  "description": "最真实的文本到语音和语音生成工具。ElevenLabs 为寻求讲故事终极工具的创作者和出版商带来了最引人注目、最丰富、最逼真的声音。",
  "url": "https://beta.elevenlabs.io",
  "image": "beta.elevenlabs.io.png"
}, {
  "title": "Play.ht",
  "description": "人工智能语音生成器与600+人工智能的声音。生成逼真的文本到语音语音与人工智能在线语音。将文本转换为音频并下载为MP3&amp;WAV文件。",
  "url": "https://play.ht",
  "image": "play.ht.png"
}, {
  "title": "Murf AI",
  "description": "AI语音生成器在20种语言。120+逼真的文本到语音的声音，创造完美的AI画外音。轻松地从文字转换为语音。",
  "url": "https://murf.ai",
  "image": "murf.ai.png"
}, {
  "title": "TTSMaker",
  "description": "TTSMaker是一个免费的文本转语音工具，提供语音合成服务，支持多种语言。",
  "url": "https://ttsmaker.com/zh-cn",
  "image": "ttsmaker.com.png"
}, {
  "title": "uberduck",
  "description": "使用多种富有表现力的声音制作 AI 配音",
  "url": "https://uberduck.ai",
  "image": "uberduck.ai.png"
}, {
  "title": "Ondoku",
  "description": "语音朗读软件Ondoku。这是一种无需安装，任何人都可以免费使用的语音朗读服务。",
  "url": "https://ondoku3.com/zh-hans",
  "image": "ondoku3.com.png"
}, {
  "title": "微软文字转语音",
  "description": "微软文本转语音 ，支持选择多种语音风格，可调节语速",
  "url": "https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech",
  "image": "azure.microsoft.com.png"
}];

const videoUrls = [{
  "title": "Rask AI",
  "description": "用AI翻译视频和音频",
  "url": "https://zh.rask.ai",
  "image": "zh.rask.ai.png"
}, {
  "title": "KreadoAI",
  "description": "AI视频创作平台，需输入文本或关键词，即可创作真实/虚拟人物的多语言口播视频，为创作者提供AI赋能",
  "url": "https://www.kreadoai.com",
  "image": "www.kreadoai.com.png"
}, {
  "title": "Fliki",
  "description": "将文本变成带有 AI 语音的视频",
  "url": "https://fliki.ai",
  "image": "fliki.ai.png"
}, {
  "title": "Hour One",
  "description": "通过虚拟人演示者将文本转换为极具吸引力的视频，在几分钟内提升您的内容。",
  "url": "https://hourone.ai",
  "image": "hourone.ai.png"
}, {
  "title": "D-ID",
  "description": "告别昂贵的传统视频创作!在几分钟内从纯文本创建视频!易于使用，价格低廉，可扩展。",
  "url": "https://www.d-id.com",
  "image": "www.d-id.com.png"
}, {
  "title": "Synthesia",
  "description": "一个AI视频创作平台，能在几分钟内从纯文本创建视频。",
  "url": "https://www.synthesia.io",
  "image": "www.synthesia.io.png"
}, {
  "title": "Runway",
  "description": "探索30多种AI驱动的创意工具，以前所未有的方式构思、生成和编辑内容。",
  "url": "https://runwayml.com",
  "image": "1679988478-Pasted.png"
}];
</script>

<template>
  <v-item-group selected-class="bg-primary">
    <v-container>
      <v-chip class="mb-2" color="primary" text-color="white" prepend-icon="mdi-robot-angry" size="x-large">
        AI 对话
      </v-chip>
      <v-row>
        <v-col
          v-for="chatUrl in chatUrls"
          :key="chatUrl.url"
          :cols="mobile ? 6 : 3"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card :class="[selectedClass]"
                    :prepend-avatar="'https://jiucai.fun/aa/map/' + chatUrl.image"
                    :href="chatUrl.url"
                    hover
                    @click="toggle">
              <template v-slot:title>
                {{ chatUrl.title }}
              </template>
              <v-card-subtitle>
                {{ chatUrl.description }}
              </v-card-subtitle>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

  <v-item-group selected-class="bg-primary">
    <v-container>
      <v-chip class="mb-2" color="primary" text-color="white" prepend-icon="mdi-rocket-launch" size="x-large">
        AI 绘图
      </v-chip>
      <v-row>
        <v-col
          v-for="chatUrl in imageUrls"
          :key="chatUrl.url"
          :cols="mobile ? 6 : 3"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card :class="[selectedClass]"
                    :prepend-avatar="'https://jiucai.fun/aa/map/' + chatUrl.image"
                    :href="chatUrl.url"
                    hover
                    @click="toggle">
              <template v-slot:title>
                {{ chatUrl.title }}
              </template>
              <v-card-subtitle>
                {{ chatUrl.description }}
              </v-card-subtitle>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

  <v-item-group selected-class="bg-primary">
    <v-container>
      <v-chip class="mb-2" color="primary" text-color="white" prepend-icon="mdi-microphone-variant" size="x-large">
        AI 语音
      </v-chip>
      <v-row>
        <v-col
          v-for="chatUrl in audioUrls"
          :key="chatUrl.url"
          :cols="mobile ? 6 : 3"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card :class="[selectedClass]"
                    :prepend-avatar="'https://jiucai.fun/aa/map/' + chatUrl.image"
                    :href="chatUrl.url"
                    hover
                    @click="toggle">
              <template v-slot:title>
                {{ chatUrl.title }}
              </template>
              <v-card-subtitle>
                {{ chatUrl.description }}
              </v-card-subtitle>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

  <v-item-group selected-class="bg-primary">
    <v-container>
      <v-chip class="mb-2" color="primary" text-color="white" prepend-icon="mdi-video-vintage" size="x-large">
        AI 视频
      </v-chip>
      <v-row>
        <v-col
          v-for="chatUrl in videoUrls"
          :key="chatUrl.url"
          :cols="mobile ? 6 : 3"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card :class="[selectedClass]"
                    :prepend-avatar="'https://jiucai.fun/aa/map/' + chatUrl.image"
                    :href="chatUrl.url"
                    hover
                    @click="toggle">
              <template v-slot:title>
                {{ chatUrl.title }}
              </template>
              <v-card-subtitle>
                {{ chatUrl.description }}
              </v-card-subtitle>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>
