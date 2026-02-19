import { getSubmissionRenderer } from "../_configs/submission-renderers";
function Renderer() {
  const Renderer = getSubmissionRenderer(material.type);
  return Renderer;
}

export default Renderer;
