/**
 * Middleware centralizzato per la gestione degli errori Express
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.url} -`, err);

  // Errore Prisma di validazione o record non trovato
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Conflitto: Questo record (email o codice) esiste già nel sistema.',
      meta: err.meta,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record non trovato nel database.',
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
