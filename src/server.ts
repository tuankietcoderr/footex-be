import express from 'express'
import { config, run } from './utils/config'
import { connectDB } from './utils/db'
import getRoutes from './routes'

const app = config(express)

getRoutes(app)
connectDB()
run(app)
