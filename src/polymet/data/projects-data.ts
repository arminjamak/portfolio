export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
  year: string;
  client: string;
  role: string;
  history: {
    phase: string;
    content: string;
    images?: { url: string; caption?: string }[];
  }[];
}

const defaultProjectsData: Project[] = [
  {
    id: "qatar",
    title: "Qatar Airways",
    category: "AI & Aviation",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/fcd92120-ce79-4407-9176-3cf0b7fb5de2/phone_animation_compressed-ezgif.com-optimize.gif?format=2500w",
    images: [
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/fcd92120-ce79-4407-9176-3cf0b7fb5de2/phone_animation_compressed-ezgif.com-optimize.gif?format=2500w",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/1b8df5a0-d737-45c7-966f-5870b0d4a085/topicbubblesgif-ezgif.com-optimize.gif?format=2500w",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/d41d49a8-3e8a-423e-ad62-856f50d0615d/light+version+gif.gif?format=2500w",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/81293208-0aad-493b-9c91-ef2dddf15119/qatarphone.webp?format=2500w",
    ],

    description:
      "Introduced real-time streaming AI avatars that visualize information as they speak. As you're conversing with the agent, it presents information and options as floating components, allowing you to guide the conversation by clicking on elements. You can also follow up with a chat message or via voice. The goal is to replace traditional chat-based LLM information architecture with something more visual, similar to a presentation generated in real-time.",
    year: "2024",
    client: "Qatar Airways",
    role: "Lead Product Designer",
    history: [
      {
        phase: "Real-time AI Agents",
        content:
          "Introduced real-time streaming AI avatars that also visualise information as they speak. As you're conversing with the agent it present information / options as floating components, allowing you to guide the conversation by clicking on elements. You can also follow up with a chat message or via voice. The goal is to replace traditional chat based LLM information architecture with something more visual similar to a presentation generated in real-time. This project was an accumulation of my research on real-time streaming avatars.",
      },
      {
        phase: "Mobile Experience",
        content:
          "On mobile, apart from the real-time agent you're also presented with quick-start options allowing you to book a flight, select a seat or configure your on-board meal preferences. You can also use this interface during flight via the on-flight Wifi.",
      },
    ],
  },
  {
    id: "mytaverse",
    title: "Mytaverse",
    category: "B2B Metaverse Platform",
    thumbnail:
      "https://framerusercontent.com/images/kDxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/kDxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/9LxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/2MxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "Complete redesign of a B2B metaverse platform for virtual events and collaboration.",
    year: "2024",
    client: "Mytaverse",
    role: "Lead Product Designer",
    history: [
      {
        phase: "Platform Redesign",
        content:
          "Led the complete redesign of Mytaverse's B2B metaverse platform, focusing on improving the virtual event experience and collaboration tools for enterprise clients.",
      },
    ],
  },
  {
    id: "colossyan",
    title: "Colossyan",
    category: "AI Avatar Editor",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/2d407a87-fd66-4f36-bff7-b86a2034e9a8/Screenshot+2025-06-04+at+17.58.39.png",
    images: [
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/2d407a87-fd66-4f36-bff7-b86a2034e9a8/Screenshot+2025-06-04+at+17.58.39.png",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/196de747-43e2-4405-8467-a373091ad634/bubblesgif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/79fffa27-b027-4950-ac84-2c82f39331bc/presentercolossyangif-ezgif.com-optimize.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/3508efae-ad10-402a-bfd8-2a71cc34a506/doc2videogif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/fc7e9bae-b9d0-4fdb-b5d0-4a3fd0ea622e/instantvideogif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/a83695f3-9b96-409f-b8ce-bff0301c4e27/templatechoosergif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/9055b258-3fc6-4592-be9d-e34fea9e1e00/loadinggif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/7ee3c2f5-6cb3-4176-a969-5e2b7affc51b/experiments.png",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/1ddd3d4a-a8f6-4237-b3f0-87c29585ee31/colossyanfinalgif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/60003509-c7fb-4f90-a780-c0c56bb5cff6/colossyangif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/a0fb7cc6-0dc4-4190-a836-98e405885e6c/colossyanavatarspagegif.gif",
      "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/cb12a5c5-ed87-42c6-809a-f4b299ce8b2f/croppinggif.gif",
    ],

    description:
      "An AI avatar editor allowing you to create interactive experiences",
    year: "2024",
    client: "Colossyan",
    role: "Lead Product Designer",
    history: [
      {
        phase: "Real-time Conversational Avatars with Interactive Visuals",
        content:
          "At Colossyan I'm leading a new product initiative (greenlit after presenting my market research and product pitch to the CEO) that involves real-time lifelike AI avatars that can visualise information as they speak. Essentially real-time presentation generation. This new product gives a personal touch to the LLM as you no longer have to communicate with AI models via chat messages, there's a face now to the model and it can show information naturally just like a person would present it. This has the potential to disrupt fields like search, teaching, marketing and sales enablement and many more.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/2d407a87-fd66-4f36-bff7-b86a2034e9a8/Screenshot+2025-06-04+at+17.58.39.png" }],
      },
      {
        phase: "How it works",
        content:
          "In the background there's the real-time stream of the realistic AI avatar that is combined with a web canvas on top of it. This web canvas can visualise information using pre-created web components like lists, topic, images with title and description, links and charts. They can be interactive as well enabling you to click on the topic you want to hear more about, or visit the link that was presented.",
      },
      {
        phase: "Process",
        content:
          "Apart from coming up with the initial product pitch the most exciting part of the project was understanding how information is visualised when there's a 'human' presenter involved. Topics for example are presented around the presenter in circular bubbles where bubbles can also go partially behind the presenter (without obstructing or hiding information) emphasising that they are situated in space. They can also be clicked allowing you to advance the conversation and have wobble physics so they gently move as you move your cursor over them. This makes information a living and interactive part of the whole experience.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/196de747-43e2-4405-8467-a373091ad634/bubblesgif.gif" }],
      },
      {
        phase: "Interactive Information Bubbles",
        content:
          "Interactive information bubbles are presented around the presenter. List are visualised side-by-side and notice how the presenter moves to the side (in real-time) to make room for the content. The contents of the list items (title, description and image) and the presenter's speech is generated by an AI model (LLM) in real-time.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/79fffa27-b027-4950-ac84-2c82f39331bc/presentercolossyangif-ezgif.com-optimize.gif" }],
      },
      {
        phase: "AI Video Creator",
        content:
          "This was a project that enabled users to create videos using AI. Users can prompt the LLM on what video to create or upload a document as the source material. They can also add interactive elements like quizzes and branching navigation.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/3508efae-ad10-402a-bfd8-2a71cc34a506/doc2videogif.gif" }],
      },
      {
        phase: "First Iteration",
        content:
          "The initial idea was to combine all of the different types of video creation into one interface. You could start by uploading a file, prompting the LLM, or by writing an exact script. After a round of user tests we realised that this kind of segmentation complicated things as users struggled to find the correct tab for their use case.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/fc7e9bae-b9d0-4fdb-b5d0-4a3fd0ea622e/instantvideogif.gif" }],
      },
      {
        phase: "Template Chooser & Loading Experience",
        content:
          "Another part of the project was improving what comes after the user specified what kind of video they want to create. The next step in the user journey was choosing a template that would define the look of the video. For this part I reworked the template selector and introduced sorting options by identifying the most important characteristics users were looking by looking at our data metrics. After that there was a fairly long loading process, to make this step more engaging I created a tips & tricks slideshow that would surface useful hints in video format while the user was waiting. Here the tips shown were selected based on what brings the most user value towards our activation metric.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/a83695f3-9b96-409f-b8ce-bff0301c4e27/templatechoosergif.gif" }],
      },
      {
        phase: "Video Creation Experiments",
        content:
          "I've also experimented with a more through rework for the video creation process where instead of templates users were able to define the visual look of the video by setting up different parameters such as the avatar presenting, fonts used and the color palette. The outcome of their choices would be visualised immediately on the right side, giving them a real-time preview. This project was unfortunately scope cut but hopefully will be implemented on a later date.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/7ee3c2f5-6cb3-4176-a969-5e2b7affc51b/experiments.png" }],
      },
      {
        phase: "Interactive Element Customization",
        content:
          "This was a project that enabled you to style interactive components such as branching and quizzes to your liking. It was especially important to comply to brand guidelines so each customer could style them to match their own corporate look. Since our users are not designers I set out to simplify the styling process to the absolute maximum possible by coming up with automation rules that figure out the necessary details.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/1ddd3d4a-a8f6-4237-b3f0-87c29585ee31/colossyanfinalgif.gif" }],
      },
      {
        phase: "Customization Process",
        content:
          "When first starting the project I was under the (later turned out to be) false impression that users wanted to have detailed customization options. So I created an accordion style layout where users could click on any element on the canvas an set up its look in every possible way. Upon user testing this solution and user intel coming in from corporate clients we realised that we needed something much simpler as the only thing that mattered is to apply the brand kit and quickly if possible. Unfortunately this information only came at a later date but I learned a lot from this initial prototype. It made me realise how quickly this feature can get complicated and what parts should and could be automated.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/60003509-c7fb-4f90-a780-c0c56bb5cff6/colossyangif.gif" }],
      },
      {
        phase: "Smart Brand Application",
        content:
          "After this prototype I set out to define the most important characteristics that define a brand look and wrote a detailed documentation on how to automate this process. By defining two types of fonts and three types of colors the whole componet can be styled. Hover states are automatically calculated based on the base color and more neat tricks. I also introduced a smart apply button that did all of this in one click by identifying what colors worked the best for the background and CTA color. I also coded this prototype to show how this logic works in action: https://button-generator-2.vercel.app/",
      },
      {
        phase: "Avatar Page",
        content:
          "A project to redesign the avatar library page on the home dashboard. The goal was to have easily hideable filtering options.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/a0fb7cc6-0dc4-4190-a836-98e405885e6c/colossyanavatarspagegif.gif" }],
      },
      {
        phase: "Creating Your Own Avatar",
        content:
          "This was a project to let users create an avatar based on themselves.",
        images: [{ url:
          "https://images.squarespace-cdn.com/content/v1/561dfdd7e4b0be4652489649/cb12a5c5-ed87-42c6-809a-f4b299ce8b2f/croppinggif.gif" }],
      },
    ],
  },
  {
    id: "prezi",
    title: "Prezi",
    category: "Presentation Editor",
    thumbnail:
      "https://framerusercontent.com/images/1QxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/1QxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/5RxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/8SxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "Designed new features for Prezi's presentation editor, focusing on improving the creation and collaboration experience.",
    year: "2023",
    client: "Prezi",
    role: "Senior Product Designer",
    history: [
      {
        phase: "Feature Design",
        content:
          "Designed new features for Prezi's presentation editor, enhancing the creation workflow and collaboration capabilities for teams.",
      },
    ],
  },
  {
    id: "piktochart",
    title: "Piktochart (Piktostory)",
    category: "AI Video Editor",
    thumbnail:
      "https://framerusercontent.com/images/3TxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/3TxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/7UxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/9VxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "AI-powered video editor (Piktostory) that simplifies video creation and editing for content creators.",
    year: "2023",
    client: "Piktochart",
    role: "Lead Product Designer",
    history: [
      {
        phase: "AI Video Editor",
        content:
          "Designed Piktostory, an AI-powered video editor that makes video creation accessible to everyone. Focus on automating complex editing tasks while maintaining creative control.",
      },
    ],
  },
  {
    id: "world-press-photo",
    title: "World Press Photo",
    category: "Website Redesign",
    thumbnail:
      "https://framerusercontent.com/images/2WxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/2WxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/6XxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/4YxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "Webby Award-winning website redesign for World Press Photo, showcasing award-winning photojournalism.",
    year: "2022",
    client: "World Press Photo",
    role: "Lead Designer",
    history: [
      {
        phase: "Webby Award Winner",
        content:
          "Led the website redesign for World Press Photo that won a Webby Award. Created an immersive experience that honors the power of photojournalism and makes the archive accessible to global audiences.",
      },
    ],
  },
  {
    id: "omron",
    title: "Omron",
    category: "Medical Device Marketplace",
    thumbnail:
      "https://framerusercontent.com/images/1QxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/1QxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/5RxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/8SxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "E-commerce platform for Omron's medical devices, making healthcare products accessible to consumers.",
    year: "2022",
    client: "Omron Healthcare",
    role: "Product Designer",
    history: [
      {
        phase: "Medical Device Marketplace",
        content:
          "Designed an e-commerce platform for Omron's medical devices, focusing on building trust and making complex healthcare products easy to understand and purchase.",
      },
    ],
  },
  {
    id: "joinme",
    title: "Join.me",
    category: "Video Conferencing",
    thumbnail:
      "https://framerusercontent.com/images/3TxWvpQMfLKqHPCKLfNmXEJGQk.png",
    images: [
      "https://framerusercontent.com/images/3TxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/7UxWvpQMfLKqHPCKLfNmXEJGQk.png",
      "https://framerusercontent.com/images/9VxWvpQMfLKqHPCKLfNmXEJGQk.png",
    ],

    description:
      "Video conferencing tool designed for seamless remote collaboration and screen sharing.",
    year: "2021",
    client: "Join.me",
    role: "Product Designer",
    history: [
      {
        phase: "Video Conferencing Tool",
        content:
          "Designed features for Join.me's video conferencing platform, focusing on making remote meetings and screen sharing effortless and reliable.",
      },
    ],
  },
];

import { storageService, isDataUrl } from "@/polymet/data/storage-service";

// LocalStorage key
const STORAGE_KEY = "portfolio_projects_data";

// Load projects from localStorage or use default data
const loadProjects = async (): Promise<Project[]> => {
  if (typeof window === "undefined") return defaultProjectsData;

  try {
    console.log(
      "[loadProjects] 🔍 Checking localStorage for key:",
      STORAGE_KEY
    );
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log(
      "[loadProjects] 🔍 localStorage data found:",
      stored ? "YES" : "NO"
    );

    if (!stored) {
      console.log("[loadProjects] ⚠️⚠️⚠️ localStorage IS EMPTY! ⚠️⚠️⚠️");
      console.log("[loadProjects] This means your data was LOST or CLEARED!");
    }

    if (stored) {
      console.log("[loadProjects] Loading projects from localStorage...");
      console.log(
        "[loadProjects] 🔍 Raw data length:",
        stored.length,
        "characters"
      );
      const projects = JSON.parse(stored);
      console.log(
        "[loadProjects] 🔍 Parsed",
        projects.length,
        "projects from localStorage"
      );

      // Log the first project's metadata BEFORE loading images
      if (projects.length > 0) {
        const firstProject = projects[0];
        console.log("[loadProjects] 🔍 First project BEFORE image loading:", {
          id: firstProject.id,
          title: firstProject.title,
          year: firstProject.year,
          client: firstProject.client,
          role: firstProject.role,
          category: firstProject.category,
        });
      }

      // Load large images from IndexedDB
      for (const project of projects) {
        // Check if thumbnail is a reference to IndexedDB
        if (project.thumbnail && project.thumbnail.startsWith("indexeddb:")) {
          const imageId = project.thumbnail.replace("indexeddb:", "");
          console.log(
            `[loadProjects] Loading thumbnail from IndexedDB: ${imageId}`
          );
          const dataUrl = await storageService.getImage(imageId);
          if (dataUrl) {
            console.log(
              `[loadProjects] ✅ Thumbnail loaded: ${imageId} (${(dataUrl.length / 1024).toFixed(1)}KB)`
            );
            project.thumbnail = dataUrl;
          } else {
            console.warn(
              `[loadProjects] ⚠️ Thumbnail not found in IndexedDB: ${imageId}`
            );
            // Remove broken IndexedDB reference
            console.log(`[loadProjects] Removing broken thumbnail IndexedDB reference: ${imageId}`);
            project.thumbnail = "";
          }
        }

        // Load images array from IndexedDB
        for (let i = 0; i < project.images.length; i++) {
          if (project.images[i] && project.images[i].startsWith("indexeddb:")) {
            const imageId = project.images[i].replace("indexeddb:", "");
            const dataUrl = await storageService.getImage(imageId);
            if (dataUrl) {
              project.images[i] = dataUrl;
            } else {
              console.warn(`[loadProjects] ⚠️ Image not found in IndexedDB: ${imageId}`);
              // Remove broken IndexedDB reference
              console.log(`[loadProjects] Removing broken image IndexedDB reference: ${imageId}`);
              project.images[i] = "";
            }
          }
        }

        // Load history images from IndexedDB
        for (let j = 0; j < project.history.length; j++) {
          if (project.history[j].images) {
            for (let k = 0; k < project.history[j].images!.length; k++) {
              const image = project.history[j].images![k];
              if (image.url && image.url.startsWith("indexeddb:")) {
                const imageId = image.url.replace("indexeddb:", "");
                console.log(`[loadProjects] Loading history image from IndexedDB: ${imageId}`);
                const dataUrl = await storageService.getImage(imageId);
                if (dataUrl) {
                  console.log(`[loadProjects] ✅ History image loaded: ${imageId} (${(dataUrl.length / 1024).toFixed(1)}KB)`);
                  project.history[j].images![k].url = dataUrl;
                } else {
                  console.warn(`[loadProjects] ⚠️ History image not found in IndexedDB: ${imageId}`);
                  // Remove broken IndexedDB reference
                  console.log(`[loadProjects] Removing broken IndexedDB reference: ${imageId}`);
                  project.history[j].images![k].url = "";
                }
              }
            }
          }
        }
      }

      console.log(`[loadProjects] ✅ Loaded ${projects.length} projects`);
      
      // Save cleaned data back to localStorage to persist the cleanup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        console.log(`[loadProjects] ✅ Cleaned data saved back to localStorage`);
      } catch (error) {
        console.error(`[loadProjects] Error saving cleaned data:`, error);
      }
      
      return projects;
    } else {
      console.log("[loadProjects] ⚠️ localStorage is empty!");

      // Check if there are images in IndexedDB - if so, we need to restore
      const allImages = await storageService.getAllImages();
      if (allImages.length > 0) {
        console.log(
          `[loadProjects] Found ${allImages.length} images in IndexedDB, but no project metadata in localStorage.`
        );
        console.log(
          "[loadProjects] This means localStorage was cleared. Restoring default data and linking to IndexedDB images..."
        );

        // Start with default data
        const restoredProjects = JSON.parse(
          JSON.stringify(defaultProjectsData)
        );

        // Try to link IndexedDB images to projects
        for (const project of restoredProjects) {
          const thumbnailId = `${project.id}-thumbnail`;
          const imageInDb = allImages.find((img) => img.id === thumbnailId);
          if (imageInDb) {
            console.log(
              `[loadProjects] ✅ Restored thumbnail for ${project.title} from IndexedDB`
            );
            project.thumbnail = imageInDb.dataUrl;
          }
        }

        // Save the restored data back to localStorage
        await saveProjects(restoredProjects);
        console.log("[loadProjects] ✅ Restored data saved to localStorage");

        return restoredProjects;
      }

      console.log("[loadProjects] No stored data found, using defaults");
    }
  } catch (error) {
    console.error(
      "[loadProjects] Error loading projects from localStorage:",
      error
    );
  }
  return defaultProjectsData;
};

// Save projects to localStorage and IndexedDB
const saveProjects = async (projects: Project[]): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    console.log("[saveProjects] Starting save process...");
    // Clone projects to avoid mutating the original
    const projectsToSave = JSON.parse(JSON.stringify(projects));

    // Move large images to IndexedDB
    for (const project of projectsToSave) {
      // Handle thumbnail - use consistent ID without timestamp
      if (project.thumbnail && isDataUrl(project.thumbnail)) {
        const imageId = `${project.id}-thumbnail`;
        console.log(`[saveProjects] Saving thumbnail to IndexedDB: ${imageId}`);
        await storageService.saveImage(imageId, project.thumbnail);
        project.thumbnail = `indexeddb:${imageId}`;
        console.log(`[saveProjects] Thumbnail saved successfully: ${imageId}`);
      }

      // Handle images array - use consistent IDs
      for (let i = 0; i < project.images.length; i++) {
        if (project.images[i] && isDataUrl(project.images[i])) {
          const imageId = `${project.id}-image-${i}`;
          await storageService.saveImage(imageId, project.images[i]);
          project.images[i] = `indexeddb:${imageId}`;
        }
      }

      // Handle history images - use consistent IDs
      for (let j = 0; j < project.history.length; j++) {
        if (project.history[j].images) {
          for (let k = 0; k < project.history[j].images!.length; k++) {
            const image = project.history[j].images![k];
            if (image.url && isDataUrl(image.url)) {
              const imageId = `${project.id}-history-${j}-${k}`;
              await storageService.saveImage(imageId, image.url);
              project.history[j].images![k].url = `indexeddb:${imageId}`;
            }
          }
        }
      }
    }

    const dataString = JSON.stringify(projectsToSave);
    const dataSize = new Blob([dataString]).size;
    const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2);

    console.log(
      `[saveProjects] Saving ${dataSizeMB}MB of project metadata to localStorage (images in IndexedDB)`
    );
    console.log(
      `[saveProjects] Number of projects to save: ${projectsToSave.length}`
    );

    // Log first project as sample WITH FULL METADATA
    if (projectsToSave.length > 0) {
      console.log("[saveProjects] 🔍 First project TO BE SAVED:", {
        id: projectsToSave[0].id,
        title: projectsToSave[0].title,
        year: projectsToSave[0].year,
        client: projectsToSave[0].client,
        role: projectsToSave[0].role,
        category: projectsToSave[0].category,
        historyLength: projectsToSave[0].history.length,
      });
    }

    localStorage.setItem(STORAGE_KEY, dataString);
    console.log("[saveProjects] ✅ Data written to localStorage");

    // Verify the save by reading it back
    const verification = localStorage.getItem(STORAGE_KEY);
    if (verification) {
      const verifiedProjects = JSON.parse(verification);
      console.log(
        `[saveProjects] ✅ Verification: ${verifiedProjects.length} projects saved successfully`
      );

      // Log the first project's metadata for verification
      if (verifiedProjects.length > 0) {
        const firstProject = verifiedProjects[0];
        console.log("[saveProjects] 🔍 First project verification:", {
          id: firstProject.id,
          title: firstProject.title,
          year: firstProject.year,
          client: firstProject.client,
          role: firstProject.role,
          category: firstProject.category,
        });
      }
    } else {
      console.error(
        "[saveProjects] ❌ Verification failed: Data not found in localStorage!"
      );
    }

    console.log(
      "[saveProjects] ✅ Save complete! Data persisted to localStorage and IndexedDB"
    );
  } catch (error) {
    if (error instanceof Error && error.name === "QuotaExceededError") {
      alert(
        "Storage quota exceeded! Your images are too large. Please use image URLs (like Squarespace CDN or Framer) instead of uploading large files."
      );
      console.error("localStorage quota exceeded. Data size too large.");
    } else {
      console.error("Error saving projects:", error);
    }
  }

  // Note: GitHub sync now happens only on admin logout to reduce build frequency
};

// Initialize projects data
export let projectsData: Project[] = [];

// Initialize async
if (typeof window !== "undefined") {
  loadProjects().then((projects) => {
    projectsData = projects;
  });
}

// Function to get all projects (always loads fresh from localStorage)
export const getProjects = async (): Promise<Project[]> => {
  projectsData = await loadProjects();
  return projectsData;
};

export const getProjectById = async (
  id: string
): Promise<Project | undefined> => {
  projectsData = await loadProjects(); // Reload from localStorage
  return projectsData.find((project) => project.id === id);
};

export const addProject = async (project: {
  title: string;
  category: string;
  thumbnail: string;
}): Promise<Project> => {
  // Always load fresh data from localStorage first
  projectsData = await loadProjects();
  const newProject: Project = {
    id: project.title.toLowerCase().replace(/\s+/g, "-"),
    title: project.title,
    category: project.category,
    thumbnail: project.thumbnail,
    images: [project.thumbnail],
    description: "New project - add description",
    year: new Date().getFullYear().toString(),
    client: "TBD",
    role: "Product Designer",
    history: [
      {
        phase: "Project Overview",
        content: "Add project details here",
      },
    ],
  };
  projectsData.push(newProject);
  await saveProjects(projectsData);
  return newProject;
};

export const updateProject = async (
  id: string,
  updates: Partial<Project>
): Promise<void> => {
  console.log("\n[updateProject] 🔵 Starting update for project:", id);
  console.log("[updateProject] Updates to apply:", {
    ...updates,
    history: updates.history ? `${updates.history.length} phases` : undefined,
  });

  // Always load fresh data from localStorage first
  console.log("[updateProject] Loading fresh data from localStorage...");
  projectsData = await loadProjects();
  console.log(`[updateProject] Loaded ${projectsData.length} projects`);

  const index = projectsData.findIndex((project) => project.id === id);
  console.log(`[updateProject] Found project at index: ${index}`);

  if (index !== -1) {
    const oldProject = { ...projectsData[index] };
    console.log("[updateProject] Old project data:", {
      title: oldProject.title,
      description: oldProject.description,
      year: oldProject.year,
      client: oldProject.client,
      role: oldProject.role,
      category: oldProject.category,
      historyLength: oldProject.history.length,
    });

    projectsData[index] = { ...projectsData[index], ...updates };

    console.log("[updateProject] New project data:", {
      title: projectsData[index].title,
      description: projectsData[index].description,
      year: projectsData[index].year,
      client: projectsData[index].client,
      role: projectsData[index].role,
      category: projectsData[index].category,
      historyLength: projectsData[index].history.length,
    });

    console.log("[updateProject] 🔍 Detailed comparison:");
    console.log(
      "  Old year:",
      oldProject.year,
      "-> New year:",
      projectsData[index].year
    );
    console.log(
      "  Old client:",
      oldProject.client,
      "-> New client:",
      projectsData[index].client
    );
    console.log(
      "  Old role:",
      oldProject.role,
      "-> New role:",
      projectsData[index].role
    );

    console.log("[updateProject] Calling saveProjects...");
    await saveProjects(projectsData);
    console.log("[updateProject] ✅ Save complete!\n");
  } else {
    console.error(`[updateProject] ❌ Project not found with id: ${id}\n`);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  // Always load fresh data from localStorage first
  projectsData = await loadProjects();
  const index = projectsData.findIndex((project) => project.id === id);
  if (index !== -1) {
    projectsData.splice(index, 1);
    await saveProjects(projectsData);
  }
};

// Reset to default data (useful for testing)
export const resetProjectsData = async (): Promise<void> => {
  projectsData = [...defaultProjectsData];
  await saveProjects(projectsData);
};

// Debug function to check IndexedDB contents
export const debugStorage = async (): Promise<void> => {
  console.log("=== STORAGE DEBUG ===");

  // Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const projects = JSON.parse(stored);
    console.log(`localStorage: ${projects.length} projects`);
    projects.forEach((p: Project) => {
      console.log(
        `  - ${p.title}: thumbnail = ${p.thumbnail.substring(0, 50)}...`
      );
    });
  } else {
    console.log("localStorage: No data");
  }

  // Check IndexedDB
  const allImages = await storageService.getAllImages();
  console.log(`\nIndexedDB: ${allImages.length} images`);
  allImages.forEach((img) => {
    const sizeMB = (img.dataUrl.length / 1024 / 1024).toFixed(2);
    console.log(
      `  - ${img.id}: ${sizeMB}MB (saved: ${new Date(img.timestamp).toLocaleString()})`
    );
  });

  console.log("=== END DEBUG ===");
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).debugStorage = debugStorage;
}
