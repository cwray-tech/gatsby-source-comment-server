exports.sourceNodes = async ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type CommentServer implements Node {
    _id: String
    author: String
    string: String
    content: String
    website: String
    slug: String
    createdAt: Date
    updatedAt: Date
  }
  `;
  createTypes(typeDefs);
};
